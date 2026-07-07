# Define here the models for your scraped items
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class AlbumItem(scrapy.Item):
    """专辑数据模型"""
    # 专辑名称
    title = scrapy.Field()
    # 艺人/乐队
    artist = scrapy.Field()
    # 发行年份
    year = scrapy.Field()
    # 流派（列表）
    genre = scrapy.Field()
    # 评分（1-100）
    rating = scrapy.Field()
    # 封面图片URL
    cover_url = scrapy.Field()
    # 简介/描述
    description = scrapy.Field()
    # 数据来源
    source = scrapy.Field()
