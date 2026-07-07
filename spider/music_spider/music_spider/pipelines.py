# Define your item pipelines here
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


import json
import os


class JsonWriterPipeline:
    """将爬取的数据保存为JSON文件"""
    
    def __init__(self):
        self.file = None
        self.items = []
    
    def open_spider(self, spider):
        # 创建输出目录
        output_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'data')
        os.makedirs(output_dir, exist_ok=True)
        
        # 打开文件
        output_file = os.path.join(output_dir, 'scraped_albums.json')
        self.file = open(output_file, 'w', encoding='utf-8')
        self.file.write('[\n')
        spider.logger.info(f"Output file: {output_file}")
    
    def close_spider(self, spider):
        # 移除最后一个逗号
        if self.items:
            self.file.seek(self.file.tell() - 2, 0)
        self.file.write('\n]')
        self.file.close()
        spider.logger.info(f"Saved {len(self.items)} albums to JSON")
    
    def process_item(self, item, spider):
        line = json.dumps(dict(item), ensure_ascii=False, indent=2)
        self.file.write(line + ',\n')
        self.items.append(item)
        return item


class AlbumValidationPipeline:
    """验证专辑数据完整性"""
    
    def process_item(self, item, spider):
        # 验证必填字段
        if not item.get('title'):
            spider.logger.warning(f"Missing title: {item}")
            return None
        
        if not item.get('artist'):
            spider.logger.warning(f"Missing artist: {item}")
            return None
        
        # 验证评分范围
        rating = item.get('rating')
        if rating and (rating < 0 or rating > 100):
            item['rating'] = min(100, max(0, rating))
        
        # 确保 genre 是列表
        genre = item.get('genre')
        if genre and isinstance(genre, str):
            item['genre'] = [g.strip() for g in genre.split(',')]
        elif not genre:
            item['genre'] = []
        
        return item
