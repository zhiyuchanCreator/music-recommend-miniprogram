"""
RateYourMusic 专辑数据爬虫
采集高分专辑信息用于小程序展示
"""
import scrapy
import re
from music_spider.items import AlbumItem


class RateYourMusicSpider(scrapy.Spider):
    """RYM 专辑爬虫 - 采集高分专辑数据"""
    
    name = "rateyourmusic"
    allowed_domains = ["rateyourmusic.com"]
    
    # 从高分专辑榜单开始
    start_urls = [
        "https://rateyourmusic.com/charts/top/album/all-time/",
    ]
    
    custom_settings = {
        'DOWNLOAD_DELAY': 2,  # 延迟2秒，避免被封
        'CONCURRENT_REQUESTS': 2,
    }
    
    def __init__(self, limit=50, **kwargs):
        """
        初始化爬虫
        :param limit: 限制采集数量，默认50张专辑
        """
        self.limit = int(limit)
        self.collected = 0
        super().__init__(**kwargs)
    
    def parse(self, response):
        """解析专辑列表页"""
        self.logger.info(f"Parsing page: {response.url}")
        
        # 提取专辑列表项
        albums = response.css('.chart_item')
        
        for album in albums:
            if self.collected >= self.limit:
                self.logger.info(f"Reached limit of {self.limit} albums")
                return
            
            # 提取基本信息
            rank = album.css('.chart_position::text').get('').strip()
            title = album.css('.album_title::text').get('') or album.css('.release_title::text').get('')
            artist = album.css('.artist::text').get('')
            
            # 提取评分
            rating_text = album.css('.chart_stats .avg_rating::text').get('')
            rating = self._parse_rating(rating_text)
            
            # 提取年份
            year_text = album.css('.chart_stats .release_year::text').get('')
            year = self._parse_year(year_text)
            
            # 提取流派
            genres = album.css('.genre::text').getall()
            genres = [g.strip() for g in genres if g.strip()]
            
            # 提取封面URL
            cover_url = album.css('.album_cover img::attr(src)').get('')
            if cover_url and cover_url.startswith('//'):
                cover_url = 'https:' + cover_url
            
            # 提取详情页链接
            detail_url = album.css('.album_title::attr(href)').get('') or album.css('a::attr(href)').get('')
            
            if title and artist:
                item = AlbumItem()
                item['title'] = title.strip()
                item['artist'] = artist.strip()
                item['year'] = year
                item['genre'] = genres if genres else []
                item['rating'] = rating
                item['cover_url'] = cover_url
                item['description'] = ''
                item['source'] = 'RYM'
                
                self.collected += 1
                yield item
                
                self.logger.info(f"[{self.collected}/{self.limit}] Collected: {title} - {artist}")
        
        # 翻页处理
        next_page = response.css('.pagination .next a::attr(href)').get()
        if next_page and self.collected < self.limit:
            yield response.follow(next_page, callback=self.parse)
    
    def _parse_rating(self, rating_text):
        """解析评分文本为数字"""
        if not rating_text:
            return 0
        match = re.search(r'(\d+\.?\d*)', rating_text.replace(',', '.'))
        if match:
            # RYM评分通常是0-5，转换为0-100
            rating = float(match.group(1))
            return int(rating * 20)
        return 0
    
    def _parse_year(self, year_text):
        """解析年份文本"""
        if not year_text:
            return None
        match = re.search(r'(\d{4})', year_text)
        if match:
            return int(match.group(1))
        return None


class MockAlbumSpider(scrapy.Spider):
    """
    模拟专辑数据爬虫
    用于测试，不依赖外部网站
    """
    
    name = "mock_albums"
    
    # 使用本地HTML或预定义数据
    start_urls = ["data:text/html,<html><body>Mock</body></html>"]
    
    def __init__(self, limit=50, **kwargs):
        self.limit = int(limit)
        super().__init__(**kwargs)
    
    def parse(self, response):
        """生成模拟专辑数据"""
        import random
        
        mock_albums = [
            {"title": "The Dark Side of the Moon", "artist": "Pink Floyd", "year": 1973, "genre": ["rock", "progressive rock"], "rating": 99},
            {"title": "Kind of Blue", "artist": "Miles Davis", "year": 1959, "genre": ["jazz", "modal jazz"], "rating": 98},
            {"title": "Abbey Road", "artist": "The Beatles", "year": 1969, "genre": ["rock", "pop"], "rating": 97},
            {"title": "OK Computer", "artist": "Radiohead", "year": 1997, "genre": ["alternative rock", "art rock"], "rating": 96},
            {"title": "Illmatic", "artist": "Nas", "year": 1994, "genre": ["hip hop", "east coast hip hop"], "rating": 95},
            {"title": "Loveless", "artist": "My Bloody Valentine", "year": 1991, "genre": ["shoegaze", "noise pop"], "rating": 94},
            {"title": "Madvillainy", "artist": "Madvillain", "year": 2004, "genre": ["hip hop", "alternative hip hop"], "rating": 93},
            {"title": "In the Aeroplane Over the Sea", "artist": "Neutral Milk Hotel", "year": 1998, "genre": ["indie rock", "folk"], "rating": 92},
            {"title": "To Pimp a Butterfly", "artist": "Kendrick Lamar", "year": 2015, "genre": ["hip hop", "jazz rap"], "rating": 91},
            {"title": "Pet Sounds", "artist": "The Beach Boys", "year": 1966, "genre": ["pop", "baroque pop"], "rating": 90},
            {"title": "Revolver", "artist": "The Beatles", "year": 1966, "genre": ["rock", "psychedelic rock"], "rating": 89},
            {"title": "Highway 61 Revisited", "artist": "Bob Dylan", "year": 1965, "genre": ["folk rock", "blues rock"], "rating": 88},
            {"title": "Thriller", "artist": "Michael Jackson", "year": 1982, "genre": ["pop", "r&b"], "rating": 87},
            {"title": "Nevermind", "artist": "Nirvana", "year": 1991, "genre": ["grunge", "alternative rock"], "rating": 86},
            {"title": "Remain in Light", "artist": "Talking Heads", "year": 1980, "genre": ["new wave", "art pop"], "rating": 85},
            {"title": "The Rise and Fall of Ziggy Stardust", "artist": "David Bowie", "year": 1972, "genre": ["glam rock", "art rock"], "rating": 84},
            {"title": "A Love Supreme", "artist": "John Coltrane", "year": 1965, "genre": ["jazz", "modal jazz"], "rating": 83},
            {"title": "Unknown Pleasures", "artist": "Joy Division", "year": 1979, "genre": ["post-punk", "gothic rock"], "rating": 82},
            {"title": "Purple Rain", "artist": "Prince", "year": 1984, "genre": ["pop", "funk"], "rating": 81},
            {"title": "Enter the Wu-Tang", "artist": "Wu-Tang Clan", "year": 1993, "genre": ["hip hop", "hardcore hip hop"], "rating": 80},
        ]
        
        # 扩展数据到指定数量
        all_genres = [
            "rock", "pop", "jazz", "hip hop", "electronic", "classical",
            "metal", "folk", "blues", "r&b", "soul", "reggae",
            "punk", "indie rock", "alternative rock", "experimental"
        ]
        
        artists_pool = [
            "Radiohead", "The Beatles", "Pink Floyd", "David Bowie", "Bob Dylan",
            "Miles Davis", "John Coltrane", "The Rolling Stones", "Led Zeppelin",
            "Nirvana", "Pixies", "Sonic Youth", "My Bloody Valentine",
            "Kendrick Lamar", "Kanye West", "Jay-Z", "Nas", "MF DOOM",
            "Björk", "Kate Bush", "Fiona Apple", "Lauryn Hill",
            "Arcade Fire", "Vampire Weekend", "Tame Impala", "Bon Iver"
        ]
        
        generated_count = 0
        for i in range(self.limit):
            if i < len(mock_albums):
                album_data = mock_albums[i]
            else:
                # 生成随机数据
                album_data = {
                    "title": f"Album {i+1}",
                    "artist": random.choice(artists_pool),
                    "year": random.randint(1960, 2024),
                    "genre": random.sample(all_genres, k=random.randint(1, 3)),
                    "rating": random.randint(70, 95)
                }
            
            item = AlbumItem()
            item['title'] = album_data['title']
            item['artist'] = album_data['artist']
            item['year'] = album_data['year']
            item['genre'] = album_data['genre']
            item['rating'] = album_data['rating']
            item['cover_url'] = f"https://picsum.photos/id/{random.randint(1, 200)}/300/300"
            item['description'] = f"A great album by {album_data['artist']}"
            item['source'] = 'Mock'
            
            generated_count += 1
            yield item
            
            self.logger.info(f"[{generated_count}/{self.limit}] Generated: {item['title']}")
