#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
专辑爬虫运行脚本
支持运行模拟爬虫或真实爬虫
"""
import os
import sys
import json
import argparse


def run_mock_spider(limit=50):
    """运行模拟爬虫，生成测试数据"""
    print(f"运行模拟爬虫，生成 {limit} 张专辑数据...")
    
    import random
    
    mock_albums = [
        {"title": "The Dark Side of the Moon", "artist": "Pink Floyd", "year": 1973, "genre": ["rock", "progressive rock"], "rating": 99, "description": "One of the best-selling albums of all time"},
        {"title": "Kind of Blue", "artist": "Miles Davis", "year": 1959, "genre": ["jazz", "modal jazz"], "rating": 98, "description": "The best-selling jazz record of all time"},
        {"title": "Abbey Road", "artist": "The Beatles", "year": 1969, "genre": ["rock", "pop"], "rating": 97, "description": "The Beatles' final masterpiece"},
        {"title": "OK Computer", "artist": "Radiohead", "year": 1997, "genre": ["alternative rock", "art rock"], "rating": 96, "description": "A landmark album of the 90s"},
        {"title": "Illmatic", "artist": "Nas", "year": 1994, "genre": ["hip hop", "east coast hip hop"], "rating": 95, "description": "One of the greatest hip hop albums ever"},
        {"title": "Loveless", "artist": "My Bloody Valentine", "year": 1991, "genre": ["shoegaze", "noise pop"], "rating": 94, "description": "The definitive shoegaze album"},
        {"title": "Madvillainy", "artist": "Madvillain", "year": 2004, "genre": ["hip hop", "alternative hip hop"], "rating": 93, "description": "MF DOOM and Madlib's masterpiece"},
        {"title": "In the Aeroplane Over the Sea", "artist": "Neutral Milk Hotel", "year": 1998, "genre": ["indie rock", "folk"], "rating": 92, "description": "A cult classic of indie rock"},
        {"title": "To Pimp a Butterfly", "artist": "Kendrick Lamar", "year": 2015, "genre": ["hip hop", "jazz rap"], "rating": 91, "description": "A modern hip hop masterpiece"},
        {"title": "Pet Sounds", "artist": "The Beach Boys", "year": 1966, "genre": ["pop", "baroque pop"], "rating": 90, "description": "Brian Wilson's pop symphony"},
        {"title": "Revolver", "artist": "The Beatles", "year": 1966, "genre": ["rock", "psychedelic rock"], "rating": 89, "description": "The Beatles' most innovative album"},
        {"title": "Highway 61 Revisited", "artist": "Bob Dylan", "year": 1965, "genre": ["folk rock", "blues rock"], "rating": 88, "description": "Dylan's electric masterpiece"},
        {"title": "Thriller", "artist": "Michael Jackson", "year": 1982, "genre": ["pop", "r&b"], "rating": 87, "description": "The best-selling album of all time"},
        {"title": "Nevermind", "artist": "Nirvana", "year": 1991, "genre": ["grunge", "alternative rock"], "rating": 86, "description": "The album that changed rock music"},
        {"title": "Remain in Light", "artist": "Talking Heads", "year": 1980, "genre": ["new wave", "art pop"], "rating": 85, "description": "Afrobeat meets new wave"},
        {"title": "The Rise and Fall of Ziggy Stardust", "artist": "David Bowie", "year": 1972, "genre": ["glam rock", "art rock"], "rating": 84, "description": "Bowie's alien rock opera"},
        {"title": "A Love Supreme", "artist": "John Coltrane", "year": 1965, "genre": ["jazz", "modal jazz"], "rating": 83, "description": "A spiritual jazz journey"},
        {"title": "Unknown Pleasures", "artist": "Joy Division", "year": 1979, "genre": ["post-punk", "gothic rock"], "rating": 82, "description": "The sound of post-punk despair"},
        {"title": "Purple Rain", "artist": "Prince", "year": 1984, "genre": ["pop", "funk"], "rating": 81, "description": "Prince's magnum opus"},
        {"title": "Enter the Wu-Tang", "artist": "Wu-Tang Clan", "year": 1993, "genre": ["hip hop", "hardcore hip hop"], "rating": 80, "description": "Raw East Coast hip hop"},
        {"title": "Sgt. Pepper's Lonely Hearts Club Band", "artist": "The Beatles", "year": 1967, "genre": ["rock", "psychedelic rock"], "rating": 98, "description": "A landmark in music history"},
        {"title": "What's Going On", "artist": "Marvin Gaye", "year": 1971, "genre": ["soul", "r&b"], "rating": 97, "description": "A concept album masterpiece"},
        {"title": "Blood on the Tracks", "artist": "Bob Dylan", "year": 1975, "genre": ["folk rock", "singer-songwriter"], "rating": 96, "description": "Dylan's emotional masterpiece"},
        {"title": "The Velvet Underground & Nico", "artist": "The Velvet Underground", "year": 1967, "genre": ["art rock", "experimental"], "rating": 95, "description": "The album that started a thousand bands"},
        {"title": "London Calling", "artist": "The Clash", "year": 1979, "genre": ["punk", "new wave"], "rating": 94, "description": "Punk rock's masterpiece"},
        {"title": "Blonde on Blonde", "artist": "Bob Dylan", "year": 1966, "genre": ["folk rock", "blues rock"], "rating": 93, "description": "Dylan's rock trilogy conclusion"},
        {"title": "The Queen Is Dead", "artist": "The Smiths", "year": 1986, "genre": ["indie rock", "alternative rock"], "rating": 92, "description": "The pinnacle of indie rock"},
        {"title": "Blue", "artist": "Joni Mitchell", "year": 1971, "genre": ["folk", "singer-songwriter"], "rating": 91, "description": "A confessional masterpiece"},
        {"title": "Led Zeppelin IV", "artist": "Led Zeppelin", "year": 1971, "genre": ["hard rock", "folk rock"], "rating": 90, "description": "Contains Stairway to Heaven"},
        {"title": "It Takes a Nation of Millions to Hold Us Back", "artist": "Public Enemy", "year": 1988, "genre": ["hip hop", "political hip hop"], "rating": 89, "description": "Revolutionary hip hop"},
        {"title": "The Stone Roses", "artist": "The Stone Roses", "year": 1989, "genre": ["indie rock", "baggy"], "rating": 88, "description": "The birth of Madchester"},
        {"title": "Disintegration", "artist": "The Cure", "year": 1989, "genre": ["gothic rock", "post-punk"], "rating": 87, "description": "The Cure's gothic masterpiece"},
        {"title": "Doolittle", "artist": "Pixies", "year": 1989, "genre": ["alternative rock", "indie rock"], "rating": 86, "description": "Influential alternative rock"},
        {"title": "Marquee Moon", "artist": "Television", "year": 1977, "genre": ["art punk", "post-punk"], "rating": 85, "description": "Guitar rock perfection"},
        {"title": "Transformer", "artist": "Lou Reed", "year": 1972, "genre": ["glam rock", "art rock"], "rating": 84, "description": "Walk on the Wild Side"},
        {"title": "Harvest", "artist": "Neil Young", "year": 1972, "genre": ["folk rock", "country rock"], "rating": 83, "description": "Young's commercial peak"},
        {"title": "Is This It", "artist": "The Strokes", "year": 2001, "genre": ["indie rock", "garage rock"], "rating": 82, "description": "Revived garage rock in the 2000s"},
        {"title": "Bitches Brew", "artist": "Miles Davis", "year": 1970, "genre": ["jazz fusion", "experimental"], "rating": 81, "description": "The birth of jazz fusion"},
        {"title": "Spiderland", "artist": "Slint", "year": 1991, "genre": ["post-rock", "math rock"], "rating": 80, "description": "The blueprint for post-rock"},
        {"title": "Daydream Nation", "artist": "Sonic Youth", "year": 1988, "genre": ["noise rock", "alternative rock"], "rating": 79, "description": "Noise rock's finest hour"},
        {"title": "The Low End Theory", "artist": "A Tribe Called Quest", "year": 1991, "genre": ["hip hop", "jazz rap"], "rating": 78, "description": "Jazz rap perfection"},
        {"title": "Horses", "artist": "Patti Smith", "year": 1975, "genre": ["punk rock", "art punk"], "rating": 77, "description": "The birth of punk poetry"},
        {"title": "Selected Ambient Works 85-92", "artist": "Aphex Twin", "year": 1992, "genre": ["ambient", "electronic"], "rating": 76, "description": "Ambient electronica classic"},
        {"title": "Grace", "artist": "Jeff Buckley", "year": 1994, "genre": ["alternative rock", "folk rock"], "rating": 75, "description": "A voice from the heavens"},
        {"title": "Electric Ladyland", "artist": "Jimi Hendrix", "year": 1968, "genre": ["psychedelic rock", "blues rock"], "rating": 74, "description": "Hendrix at his peak"},
        {"title": "Closer", "artist": "Joy Division", "year": 1980, "genre": ["post-punk", "gothic rock"], "rating": 73, "description": "A dark, haunting farewell"},
        {"title": "Blue Lines", "artist": "Massive Attack", "year": 1991, "genre": ["trip hop", "electronic"], "rating": 72, "description": "The birth of trip hop"},
        {"title": "Rumours", "artist": "Fleetwood Mac", "year": 1977, "genre": ["pop rock", "soft rock"], "rating": 71, "description": "Breakup album perfection"},
        {"title": "Entertainment!", "artist": "Gang of Four", "year": 1979, "genre": ["post-punk", "funk"], "rating": 70, "description": "Political post-punk"},
        {"title": "Homogenic", "artist": "Björk", "year": 1997, "genre": ["electronic", "art pop"], "rating": 69, "description": "Icelandic electronic perfection"},
        {"title": "Automatic for the People", "artist": "R.E.M.", "year": 1992, "genre": ["alternative rock", "folk rock"], "rating": 68, "description": "Mature alternative rock"},
        {"title": "Axis: Bold as Love", "artist": "Jimi Hendrix", "year": 1967, "genre": ["psychedelic rock", "blues rock"], "rating": 67, "description": "Psychedelic guitar wizardry"},
        {"title": "Psychocandy", "artist": "The Jesus and Mary Chain", "year": 1985, "genre": ["noise pop", "shoegaze"], "rating": 66, "description": "Noise pop pioneers"},
        {"title": "Exile on Main St.", "artist": "The Rolling Stones", "year": 1972, "genre": ["rock", "blues rock"], "rating": 65, "description": "The Stones at their best"},
        {"title": "Liquid Swords", "artist": "GZA", "year": 1995, "genre": ["hip hop", "east coast hip hop"], "rating": 64, "description": "Wu-Tang's lyrical masterpiece"},
        {"title": "Siamese Dream", "artist": "The Smashing Pumpkins", "year": 1993, "genre": ["alternative rock", "shoegaze"], "rating": 63, "description": "90s alternative rock epic"},
        {"title": "Dummy", "artist": "Portishead", "year": 1994, "genre": ["trip hop", "electronic"], "rating": 62, "description": "Trip hop noir"},
        {"title": "Paul's Boutique", "artist": "Beastie Boys", "year": 1989, "genre": ["hip hop", "sampledelia"], "rating": 61, "description": "Sampling masterpiece"},
        {"title": "In Utero", "artist": "Nirvana", "year": 1993, "genre": ["grunge", "alternative rock"], "rating": 60, "description": "Nirvana's raw farewell"},
    ]
    
    all_genres = [
        "rock", "pop", "jazz", "hip hop", "electronic", "classical",
        "metal", "folk", "blues", "r&b", "soul", "reggae",
        "punk", "indie rock", "alternative rock", "experimental",
        "shoegaze", "post-punk", "new wave", "grunge", "funk"
    ]
    
    artists_pool = [
        "Radiohead", "The Beatles", "Pink Floyd", "David Bowie", "Bob Dylan",
        "Miles Davis", "John Coltrane", "The Rolling Stones", "Led Zeppelin",
        "Nirvana", "Pixies", "Sonic Youth", "My Bloody Valentine",
        "Kendrick Lamar", "Kanye West", "Jay-Z", "Nas", "MF DOOM",
        "Björk", "Kate Bush", "Fiona Apple", "Lauryn Hill",
        "Arcade Fire", "Vampire Weekend", "Tame Impala", "Bon Iver",
        "The Smiths", "New Order", "Depeche Mode", "The Cure",
        "Metallica", "Black Sabbath", "Iron Maiden", "Slayer",
        "Stevie Wonder", "Marvin Gaye", "Aretha Franklin", "James Brown"
    ]
    
    albums = []
    for i in range(limit):
        # 如果请求数量超过真实数据，循环使用真实数据
        album_index = i % len(mock_albums)
        album = mock_albums[album_index].copy()
        
        # 添加封面URL和ID
        album['_id'] = f"album_{i+1:03d}"
        album['coverUrl'] = None
        album['source'] = 'Mock'
        
        # 字段映射（兼容小程序数据结构）
        album['cover_url'] = album['coverUrl']
        
        albums.append(album)
        print(f"  [{i+1}/{limit}] {album['title']} - {album['artist']}")
    
    # 保存为JSON
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = os.path.join(output_dir, 'scraped_albums.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(albums, f, ensure_ascii=False, indent=2)
    
    print(f"\n成功生成 {len(albums)} 张专辑数据")
    print(f"数据已保存到: {output_file}")
    
    return albums


def run_scrapy_spider(spider_name='mock_albums', limit=50):
    """运行Scrapy爬虫"""
    try:
        from scrapy.crawler import CrawlerProcess
        from scrapy.utils.project import get_project_settings
        
        # 获取项目设置
        settings = get_project_settings()
        
        # 创建爬虫进程
        process = CrawlerProcess(settings)
        
        # 启动爬虫
        print(f"启动 Scrapy 爬虫: {spider_name} (limit={limit})")
        process.crawl(spider_name, limit=limit)
        process.start()
        
    except ImportError as e:
        print(f"Scrapy 未安装: {e}")
        print("请先安装依赖: pip install -r requirements.txt")
        return False
    
    return True


def main():
    parser = argparse.ArgumentParser(description='专辑数据爬虫运行脚本')
    parser.add_argument('--mock', action='store_true', help='使用模拟数据（无需Scrapy）')
    parser.add_argument('--spider', default='mock_albums', help='Scrapy爬虫名称')
    parser.add_argument('--limit', type=int, default=50, help='采集数量限制（默认50）')
    
    args = parser.parse_args()
    
    if args.mock:
        # 使用纯Python生成模拟数据
        run_mock_spider(limit=args.limit)
    else:
        # 尝试运行Scrapy爬虫
        success = run_scrapy_spider(spider_name=args.spider, limit=args.limit)
        if not success:
            print("\n切换到模拟数据模式...")
            run_mock_spider(limit=args.limit)


if __name__ == '__main__':
    main()
