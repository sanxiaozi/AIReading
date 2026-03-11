#!/usr/bin/env python3
"""
自动抓取书籍封面图脚本
通过 Open Library / Google Books API 获取封面
"""
import json
import os
import time
import requests
from pathlib import Path

BOOKS = [
    (1, "原则", "Ray Dalio"),
    (2, "思考，快与慢", "Daniel Kahneman"),
    (3, "人类简史", "Yuval Noah Harari"),
    (4, "刻意练习", "Anders Ericsson"),
    (5, "影响力", "Robert Cialdini"),
    (6, "高效能人士的七个习惯", "Stephen Covey"),
    (7, "穷查理宝典", "Charlie Munger"),
    (8, "自控力", "Kelly McGonigal"),
    (9, "非暴力沟通", "Marshall Rosenberg"),
    (10, "亲密关系", "Rowland Miller"),
    (11, "反脆弱", "Nassim Taleb"),
    (12, "黑天鹅", "Nassim Taleb"),
    (13, "从0到1", "Peter Thiel"),
    (14, "创新者的窘境", "Clayton Christensen"),
    (15, "精益创业", "Eric Ries"),
    (16, "心流", "Mihaly Csikszentmihalyi"),
    (17, "被讨厌的勇气", "岸见一郎"),
    (18, "活出生命的意义", "Viktor Frankl"),
    (19, "乌合之众", "Gustave Le Bon"),
    (20, "社会心理学", "David Myers"),
    (21, "枪炮、病菌与钢铁", "Jared Diamond"),
    (22, "未来简史", "Yuval Noah Harari"),
    (23, "今日简史", "Yuval Noah Harari"),
    (24, "万历十五年", "黄仁宇"),
    (25, "明朝那些事儿", "当年明月"),
    (26, "苏东坡传", "林语堂"),
    (27, "曾国藩传", "张宏杰"),
    (28, "史蒂夫·乔布斯传", "Walter Isaacson"),
    (29, "埃隆·马斯克传", "Walter Isaacson"),
    (30, "鞋狗", "Phil Knight"),
    (31, "基因传", "Siddhartha Mukherjee"),
    (32, "自私的基因", "Richard Dawkins"),
    (33, "时间简史", "Stephen Hawking"),
    (34, "上帝掷骰子吗", "曹天元"),
    (35, "失控", "Kevin Kelly"),
    (36, "奇点临近", "Ray Kurzweil"),
    (37, "小王子", "Antoine de Saint-Exupéry"),
    (38, "追风筝的人", "Khaled Hosseini"),
    (39, "百年孤独", "Gabriel García Márquez"),
    (40, "1984", "George Orwell"),
    (41, "动物农场", "George Orwell"),
    (42, "了不起的盖茨比", "F. Scott Fitzgerald"),
    (43, "月亮与六便士", "W. Somerset Maugham"),
    (44, "如何阅读一本书", "Mortimer J. Adler"),
    (45, "学会提问", "M. Neil Browne"),
    (46, "金字塔原理", "Barbara Minto"),
    (47, "深度工作", "Cal Newport"),
    (48, "原子习惯", "James Clear"),
    (49, "纳瓦尔宝典", "Eric Jorgenson"),
    (50, "认知觉醒", "周岭"),
]

# 英文书名映射（用于API查询）
EN_TITLES = {
    1: "Principles Ray Dalio",
    2: "Thinking Fast and Slow",
    3: "Sapiens Yuval Noah Harari",
    4: "Peak Secrets from the New Science of Expertise",
    5: "Influence Robert Cialdini",
    6: "The 7 Habits of Highly Effective People",
    7: "Poor Charlies Almanack",
    8: "The Willpower Instinct",
    9: "Nonviolent Communication Marshall Rosenberg",
    10: "Intimate Relationships Rowland Miller",
    11: "Antifragile Nassim Taleb",
    12: "The Black Swan Nassim Taleb",
    13: "Zero to One Peter Thiel",
    14: "The Innovators Dilemma Clayton Christensen",
    15: "The Lean Startup Eric Ries",
    16: "Flow Mihaly Csikszentmihalyi",
    17: "The Courage to Be Disliked",
    18: "Mans Search for Meaning Viktor Frankl",
    19: "The Crowd Gustave Le Bon",
    20: "Social Psychology David Myers",
    21: "Guns Germs and Steel Jared Diamond",
    22: "Homo Deus Yuval Noah Harari",
    23: "21 Lessons for the 21st Century",
    24: "1587 A Year of No Significance",
    25: "Ming Dynasty Those Things",
    26: "The Gay Genius Lin Yutang",
    27: "Zeng Guofan",
    28: "Steve Jobs Walter Isaacson",
    29: "Elon Musk Walter Isaacson",
    30: "Shoe Dog Phil Knight",
    31: "The Gene Siddhartha Mukherjee",
    32: "The Selfish Gene Richard Dawkins",
    33: "A Brief History of Time Stephen Hawking",
    34: "The Quantum Universe",
    35: "Out of Control Kevin Kelly",
    36: "The Singularity Is Near Ray Kurzweil",
    37: "The Little Prince",
    38: "The Kite Runner Khaled Hosseini",
    39: "One Hundred Years of Solitude",
    40: "1984 George Orwell",
    41: "Animal Farm George Orwell",
    42: "The Great Gatsby",
    43: "The Moon and Sixpence",
    44: "How to Read a Book Mortimer Adler",
    45: "Asking the Right Questions",
    46: "The Pyramid Principle Barbara Minto",
    47: "Deep Work Cal Newport",
    48: "Atomic Habits James Clear",
    49: "The Almanack of Naval Ravikant",
    50: "Cognitive Awakening",
}

BASE_DIR = Path(__file__).parent.parent
COVERS_DIR = BASE_DIR / "public" / "covers"

def fetch_google_books(query):
    """通过 Google Books API 获取封面"""
    try:
        url = f"https://www.googleapis.com/books/v1/volumes?q={requests.utils.quote(query)}&maxResults=1"
        r = requests.get(url, timeout=10)
        data = r.json()
        items = data.get("items", [])
        if not items:
            return None
        info = items[0].get("volumeInfo", {})
        img = info.get("imageLinks", {})
        # 优先用高清图
        cover_url = img.get("extraLarge") or img.get("large") or img.get("medium") or img.get("thumbnail")
        if cover_url:
            # 去掉 zoom 参数，获取更大图
            cover_url = cover_url.replace("zoom=1", "zoom=0").replace("&edge=curl", "").replace("http://", "https://")
        return cover_url
    except Exception as e:
        print(f"  Google Books 错误: {e}")
        return None

def fetch_open_library(title, author):
    """通过 Open Library 获取封面"""
    try:
        query = f"{title} {author}"
        url = f"https://openlibrary.org/search.json?q={requests.utils.quote(query)}&limit=1"
        r = requests.get(url, timeout=10)
        data = r.json()
        docs = data.get("docs", [])
        if not docs:
            return None
        cover_id = docs[0].get("cover_i")
        if cover_id:
            return f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
        return None
    except Exception as e:
        print(f"  Open Library 错误: {e}")
        return None

def download_image(url, save_path):
    """下载图片"""
    try:
        r = requests.get(url, timeout=15, headers={"User-Agent": "Mozilla/5.0"})
        if r.status_code == 200 and len(r.content) > 5000:
            save_path.parent.mkdir(parents=True, exist_ok=True)
            with open(save_path, "wb") as f:
                f.write(r.content)
            return True
    except Exception as e:
        print(f"  下载失败: {e}")
    return False

def main():
    success = 0
    failed = []
    
    for book_id, title, author in BOOKS:
        save_path = COVERS_DIR / str(book_id) / "cover.jpg"
        if save_path.exists():
            print(f"✅ [{book_id}] {title} — 已存在，跳过")
            success += 1
            continue
        
        print(f"🔍 [{book_id}] {title}...")
        
        cover_url = None
        
        # 先用英文书名查 Google Books
        en_query = EN_TITLES.get(book_id, f"{title} {author}")
        cover_url = fetch_google_books(en_query)
        
        # 备选：Open Library
        if not cover_url:
            cover_url = fetch_open_library(title, author)
        
        if cover_url and download_image(cover_url, save_path):
            print(f"  ✅ 下载成功")
            success += 1
        else:
            print(f"  ❌ 获取失败")
            failed.append((book_id, title))
        
        time.sleep(0.5)
    
    print(f"\n完成！成功: {success}/50，失败: {len(failed)}")
    if failed:
        print("失败列表:")
        for bid, t in failed:
            print(f"  [{bid}] {t}")

if __name__ == "__main__":
    main()
