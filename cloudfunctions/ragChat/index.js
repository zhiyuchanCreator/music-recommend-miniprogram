/**
 * ragChat：RAG 音乐探索 Agent
 *
 * 流程：
 *   1. 意图解析：LLM 从用户问题提取 genres / artists / mood / decades（JSON）
 *   2. 检索：用解析结果在 albums 集合做正则匹配，召回候选（不足时回退高分专辑）
 *   3. 生成：把候选专辑作为上下文，LLM 生成口语化推荐 + 推荐理由
 *
 * 出参：
 *   { success, answer, albums: [{ id, title, artist, coverUrl }], debug }
 *
 * 环境变量（云开发控制台 → 云函数 → ragChat → 配置）：
 *   ZHIPU_API_KEY  智谱开放平台 API Key（必填）
 *   ZHIPU_MODEL    模型名，默认 glm-4-flash（免费）
 */
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const https = require('https');

const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const ZHIPU_MODEL = process.env.ZHIPU_MODEL || 'glm-4-flash';
const LLM_TIMEOUT_MS = 25000;
const MAX_CANDIDATES = 12;

// ========== 智谱 API 调用 ==========

function callZhipu(messages, options = {}) {
  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) {
    return Promise.reject(new Error('未配置 ZHIPU_API_KEY 环境变量'));
  }

  const payload = JSON.stringify({
    model: ZHIPU_MODEL,
    messages,
    temperature: options.temperature ?? 0.6,
    max_tokens: options.maxTokens ?? 1024
  });

  return new Promise((resolve, reject) => {
    const req = https.request(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: LLM_TIMEOUT_MS
    }, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (res.statusCode !== 200) {
            return reject(new Error(`智谱 API ${res.statusCode}: ${data.error?.message || body.slice(0, 200)}`));
          }
          const content = data.choices?.[0]?.message?.content;
          if (!content) {
            return reject(new Error('智谱 API 返回内容为空'));
          }
          resolve(content);
        } catch (err) {
          reject(new Error(`智谱 API 响应解析失败: ${body.slice(0, 200)}`));
        }
      });
    });
    req.on('timeout', () => {
      req.destroy(new Error('智谱 API 请求超时'));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// 从 LLM 输出中解析 JSON（容忍代码块包裹）
function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch (err) {
    return null;
  }
}

// ========== 第一步：意图解析 ==========

async function parseIntent(question) {
  const messages = [
    {
      role: 'system',
      content: '你是音乐推荐系统的查询解析器。从用户问题中提取音乐偏好，只输出 JSON，格式：'
        + '{"genres":["如 jazz, rock, hip hop"],"artists":["艺术家名"],"mood":["如 深夜, 放松, 运动"],"decades":["如 1970s, 1990s"]}'
        + '。流派用英文小写。没有的字段留空数组，不要输出任何其他文字。'
    },
    { role: 'user', content: question }
  ];

  const raw = await callZhipu(messages, { temperature: 0.1, maxTokens: 256 });
  const intent = extractJson(raw) || {};
  return {
    genres: (intent.genres || []).map(s => String(s).toLowerCase().trim()).filter(Boolean).slice(0, 3),
    artists: (intent.artists || []).map(s => String(s).trim()).filter(Boolean).slice(0, 3),
    mood: (intent.mood || []).map(s => String(s).trim()).filter(Boolean).slice(0, 3),
    decades: (intent.decades || []).map(s => String(s).trim()).filter(Boolean).slice(0, 2)
  };
}

// ========== 第二步：检索候选专辑 ==========

async function retrieveCandidates(intent) {
  const queries = [];

  intent.genres.forEach(genre => {
    queries.push(
      db.collection('albums').where({
        genre: db.RegExp({ regexp: escapeRegex(genre), options: 'i' })
      }).limit(15).get()
    );
  });
  intent.artists.forEach(artist => {
    queries.push(
      db.collection('albums').where({
        artist: db.RegExp({ regexp: escapeRegex(artist), options: 'i' })
      }).limit(10).get()
    );
  });
  intent.mood.forEach(word => {
    queries.push(
      db.collection('albums').where({
        description: db.RegExp({ regexp: escapeRegex(word), options: 'i' })
      }).limit(10).get()
    );
  });

  if (queries.length === 0) return [];

  const results = await Promise.all(queries);
  const albumMap = new Map();
  results.forEach(res => res.data.forEach(album => {
    if (!albumMap.has(album._id)) albumMap.set(album._id, album);
  }));

  let candidates = Array.from(albumMap.values());

  // 检索不足时补充高分专辑，保证 LLM 始终有上下文可用
  if (candidates.length < 5) {
    const topRes = await db.collection('albums')
      .orderBy('rating', 'desc')
      .limit(10)
      .get();
    topRes.data.forEach(album => {
      if (!albumMap.has(album._id)) albumMap.set(album._id, album);
    });
    candidates = Array.from(albumMap.values());
  }

  return candidates.slice(0, MAX_CANDIDATES);
}

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ========== 第三步：生成推荐 ==========

async function generateAnswer(question, candidates) {
  const context = candidates.map(album => ({
    id: album._id,
    title: album.title,
    artist: album.artist,
    year: album.year,
    genre: album.genre,
    rating: album.rating,
    description: (album.description || '').slice(0, 120)
  }));

  const messages = [
    {
      role: 'system',
      content: '你是 Shfl，一个 AI 音乐探索助手。用户想发现新专辑。基于给定的候选专辑列表，'
        + '挑选 2-4 张最符合用户问题的专辑，用中文口语化地说明为什么推荐（结合流派、年代、艺术家、简介），'
        + '回答控制在 200 字以内，像懂音乐的朋友聊天，不要列表符号，提到专辑名时用《》。'
        + '只能推荐候选列表里的专辑，不要编造。'
    },
    {
      role: 'user',
      content: `用户的问题：${question}\n\n候选专辑列表（JSON）：${JSON.stringify(context)}`
    }
  ];

  return callZhipu(messages, { temperature: 0.7, maxTokens: 512 });
}

// ========== 入口 ==========

exports.main = async (event) => {
  const { question } = event || {};
  const trimmed = String(question || '').trim();

  if (!trimmed) {
    return { success: false, errMsg: '问题不能为空' };
  }
  if (trimmed.length > 200) {
    return { success: false, errMsg: '问题太长了，请控制在 200 字以内' };
  }

  try {
    const intent = await parseIntent(trimmed);
    const candidates = await retrieveCandidates(intent);

    if (candidates.length === 0) {
      return {
        success: true,
        answer: '暂时没找到相关的专辑，试试换个说法，比如「适合深夜的爵士」。',
        albums: [],
        debug: { intent }
      };
    }

    const answer = await generateAnswer(trimmed, candidates);

    // 只返回被 LLM 提到的专辑 + 其余候选，供前端展示卡片
    const mentioned = candidates.filter(album => answer.includes(album.title));
    const shown = (mentioned.length > 0 ? mentioned : candidates.slice(0, 4))
      .slice(0, 4)
      .map(album => ({
        id: album._id,
        title: album.title,
        artist: album.artist,
        coverUrl: album.coverUrl
      }));

    return {
      success: true,
      answer,
      albums: shown,
      debug: { intent, candidateCount: candidates.length }
    };
  } catch (err) {
    console.error('[ragChat] failed:', err);
    return { success: false, errMsg: err.message || String(err) };
  }
};
