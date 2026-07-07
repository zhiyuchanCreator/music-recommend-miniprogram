#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""检查爬虫数据质量"""
import json

with open('../data/scraped_albums.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f'共 {len(data)} 张专辑')

print('\n检查是否有占位符:')
placeholders = [a for a in data if a['title'].startswith('Album ')]
print(f'  占位符数量: {len(placeholders)}')

print('\n最后5张专辑:')
for a in data[-5:]:
    print(f'  {a["title"]} - {a["artist"]}')

print('\n流派分布 (Top 10):')
genres = {}
for album in data:
    for g in album['genre']:
        genres[g] = genres.get(g, 0) + 1
for g, c in sorted(genres.items(), key=lambda x: -x[1])[:10]:
    print(f'  {g}: {c}张')
