#!/usr/bin/env python3
"""
内容审计脚本：检查书籍内容中的重复段落
"""
import json
import os
import re
from pathlib import Path
from typing import Dict, List, Tuple
from difflib import SequenceMatcher

def strip_html(text: str) -> str:
    """移除 HTML 标签，只保留纯文本"""
    return re.sub(r'<[^>]+>', '', text)

def normalize_text(text: str) -> str:
    """标准化文本：移除多余空格和换行"""
    text = strip_html(text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def get_sentences(text: str) -> List[str]:
    """将文本分割成句子"""
    text = normalize_text(text)
    # 支持中英文句子分割
    sentences = re.split(r'[。！？\.!?]\s*', text)
    return [s.strip() for s in sentences if len(s.strip()) > 10]

def get_paragraphs(text: str) -> List[str]:
    """将 HTML 文本分割成段落"""
    # 按 <p> 标签分割
    paragraphs = re.findall(r'<p>(.*?)</p>', text, re.DOTALL)
    return [normalize_text(p) for p in paragraphs if len(normalize_text(p)) > 20]

def similarity_ratio(text1: str, text2: str) -> float:
    """计算两段文本的相似度（0-1）"""
    return SequenceMatcher(None, text1, text2).ratio()

def find_duplicate_content(short: str, medium: str, long: str) -> Dict:
    """查找三个版本之间的重复内容"""
    issues = []
    
    # 检查 medium 和 long 之间的重复段落
    medium_paras = get_paragraphs(medium)
    long_paras = get_paragraphs(long)
    
    for i, m_para in enumerate(medium_paras):
        for j, l_para in enumerate(long_paras):
            ratio = similarity_ratio(m_para, l_para)
            if ratio > 0.85:  # 85% 以上相似度
                issues.append({
                    'type': 'medium_long_duplicate',
                    'similarity': ratio,
                    'medium_para': i,
                    'long_para': j,
                    'text_preview': m_para[:100] + '...'
                })
    
    # 检查 short 是否完全包含在 medium 中
    short_normalized = normalize_text(short)
    medium_normalized = normalize_text(medium)
    
    if short_normalized in medium_normalized:
        issues.append({
            'type': 'short_in_medium',
            'text_preview': short_normalized[:100] + '...'
        })
    
    # 检查句子级别的重复
    medium_sentences = get_sentences(medium)
    long_sentences = get_sentences(long)
    
    duplicate_sentences = 0
    for m_sent in medium_sentences:
        for l_sent in long_sentences:
            if similarity_ratio(m_sent, l_sent) > 0.9:
                duplicate_sentences += 1
                break
    
    if duplicate_sentences > len(medium_sentences) * 0.3:  # 超过30%的句子重复
        issues.append({
            'type': 'high_sentence_overlap',
            'duplicate_count': duplicate_sentences,
            'total_medium_sentences': len(medium_sentences),
            'ratio': duplicate_sentences / len(medium_sentences)
        })
    
    return {
        'has_issues': len(issues) > 0,
        'issue_count': len(issues),
        'issues': issues
    }

def check_book(book_id: int, locale: str) -> Dict:
    """检查单本书的内容"""
    file_path = Path(f'content/books/{book_id}/{locale}.json')
    
    if not file_path.exists():
        return {'error': f'File not found: {file_path}'}
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        result = find_duplicate_content(
            data.get('summary_short', ''),
            data.get('summary_medium', ''),
            data.get('summary_long', '')
        )
        
        return {
            'book_id': book_id,
            'locale': locale,
            'title': data.get('title', 'Unknown'),
            **result
        }
    except Exception as e:
        return {'error': str(e), 'book_id': book_id, 'locale': locale}

def main():
    """主函数：检查所有书籍"""
    results = []
    
    # 检查所有 50 本书
    for book_id in range(1, 51):
        for locale in ['zh', 'en']:
            result = check_book(book_id, locale)
            results.append(result)
            
            if result.get('has_issues'):
                print(f"⚠️  Book {book_id} ({locale}): Found {result['issue_count']} issues")
            else:
                print(f"✅ Book {book_id} ({locale}): No issues")
    
    # 保存结果
    output_path = Path('scripts/audit_results.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    # 统计
    total_books = len(results)
    books_with_issues = sum(1 for r in results if r.get('has_issues'))
    total_issues = sum(r.get('issue_count', 0) for r in results)
    
    print(f"\n📊 统计结果：")
    print(f"   总书籍数: {total_books}")
    print(f"   有问题的书籍: {books_with_issues}")
    print(f"   总问题数: {total_issues}")
    print(f"\n详细结果已保存到: {output_path}")
    
    return results

if __name__ == '__main__':
    main()
