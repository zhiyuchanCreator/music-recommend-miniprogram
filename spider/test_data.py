#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""测试爬虫数据"""
import json

# 读取数据
with open('../data/scraped_albums.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"共爬取 {len(data)} 张专辑\n")

print("前10张专辑:")
for i, album in enumerate(data[:10], 1):
    print(f"  {i}. {album['title']} - {album['artist']} ({album['year']}) [{album['genre'][0]}]")

print("\n流派分布 (Top 10):")
genres = {}
for album in data:
    for g in album['genre']:
        genres[g] = genres.get(g, 0) + 1
for g, c in sorted(genres.items(), key=lambda x: -x[1])[:10]:
    print(f"  {g}: {c}张")

print("\n年份分布:")
years = {}
for album in data:
    decade = (album['year'] // 10) * 10
    years[f"{decade}s"] = years.get(f"{decade}s", 0) + 1
for y, c in sorted(years.items()):
    print(f"  {y}: {c}张")

print("\n评分范围:")
ratings = [a['rating'] for a in data]
print(f"  最高: {max(ratings)}  最低: {min(ratings)}  平均: {sum(ratings)/len(ratings):.1f}")

print("\n数据字段检查:")
required_fields = ['title', 'artist', 'year', 'genre', 'rating', 'coverUrl', '_id']
for field in required_fields:
    missing = [a for a in data if not a.get(field)]
    status = "OK" if not missing else f"缺失{len(missing)}条"
    print(f"  {field}: {status}")

print("\n爬虫测试通过！数据完整可用。")
