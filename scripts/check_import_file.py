#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json

# 检查云函数目录的数据文件
with open('cloudfunctions/importData/albums_for_import.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f'云函数数据文件: {len(data)} 张专辑')
print(f'\n前3张:')
for a in data[:3]:
    print(f'  - {a["title"]}')
print(f'\n后3张:')
for a in data[-3:]:
    print(f'  - {a["title"]}')

# 检查是否有重复
titles = [a['title'] for a in data]
unique_titles = set(titles)
if len(titles) != len(unique_titles):
    print(f'\n警告: 有 {len(titles) - len(unique_titles)} 张重复专辑')
else:
    print(f'\n检查: 无重复专辑')
