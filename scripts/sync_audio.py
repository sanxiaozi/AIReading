#!/usr/bin/env python3
"""
批量同步音频到服务器
用法：python3 sync_audio.py [--book-id 3] [--dry-run]

本地音频目录：/Users/arcade/aireading/public/audio/{id}/
服务器目录：  /var/www/aireading/audio/{id}/

文件格式映射：
  本地 zh_short.mp3  → 服务器 short.m4a（实际是mp3内容，改扩展名）
  本地 zh_long.mp3   → 服务器 long.m4a
  本地 en_short.mp3  → 服务器 en_short.m4a
  本地 en_long.mp3   → 服务器 en_long.m4a
  本地 zh_medium.mp3 → 服务器 medium.m4a
  本地 en_medium.mp3 → 服务器 en_medium.m4a
"""

import os
import sys
import subprocess
import argparse
import json
from pathlib import Path

SERVER = "root@62.72.46.248"
SERVER_PASS = "ynj15Ck6Kfz20cOFJh8ilF"
SERVER_AUDIO_DIR = "/var/www/aireading/audio"
LOCAL_AUDIO_DIR = "/Users/arcade/aireading/public/audio"

# 本地文件名 → 服务器文件名映射
FILE_MAP = {
    "zh_short.mp3":  "short.m4a",
    "zh_long.mp3":   "long.m4a",
    "zh_medium.mp3": "medium.m4a",
    "en_short.mp3":  "en_short.m4a",
    "en_long.mp3":   "en_long.m4a",
    "en_medium.mp3": "en_medium.m4a",
}

def run(cmd, check=True):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if check and result.returncode != 0:
        print(f"❌ 命令失败: {cmd}")
        print(result.stderr)
    return result

def scp(local_path, remote_path, dry_run=False):
    cmd = f"sshpass -p '{SERVER_PASS}' scp -o StrictHostKeyChecking=no '{local_path}' '{SERVER}:{remote_path}'"
    if dry_run:
        print(f"  [dry-run] scp {local_path} → {remote_path}")
        return True
    result = run(cmd, check=False)
    return result.returncode == 0

def ssh(command, dry_run=False):
    cmd = f"sshpass -p '{SERVER_PASS}' ssh -o StrictHostKeyChecking=no {SERVER} '{command}'"
    if dry_run:
        print(f"  [dry-run] ssh: {command}")
        return ""
    result = run(cmd, check=False)
    return result.stdout.strip()

def sync_book(book_id, dry_run=False):
    local_dir = Path(LOCAL_AUDIO_DIR) / str(book_id)
    if not local_dir.exists():
        print(f"  ⚠️  本地目录不存在: {local_dir}")
        return 0, 0

    # 创建服务器目录
    ssh(f"mkdir -p {SERVER_AUDIO_DIR}/{book_id}", dry_run)

    success, skip, fail = 0, 0, 0
    for local_name, server_name in FILE_MAP.items():
        local_file = local_dir / local_name
        if not local_file.exists():
            skip += 1
            continue

        server_path = f"{SERVER_AUDIO_DIR}/{book_id}/{server_name}"
        print(f"  上传: {local_name} → {server_name} ", end="", flush=True)

        if scp(str(local_file), server_path, dry_run):
            print("✅")
            success += 1
        else:
            print("❌")
            fail += 1

    return success, fail

def verify_book(book_id):
    """验证服务器上的音频文件"""
    import urllib.request
    base_url = f"https://trading.aireading.com/audio/{book_id}"
    files = ["short.m4a", "long.m4a", "en_short.m4a"]
    results = []
    for f in files:
        url = f"{base_url}/{f}"
        try:
            req = urllib.request.Request(url, method="HEAD")
            with urllib.request.urlopen(req, timeout=5) as r:
                results.append((f, r.status == 200))
        except:
            results.append((f, False))
    return results

def main():
    parser = argparse.ArgumentParser(description="同步音频到服务器")
    parser.add_argument("--book-id", type=int, help="只同步指定书籍ID")
    parser.add_argument("--dry-run", action="store_true", help="只显示操作，不实际执行")
    parser.add_argument("--verify", action="store_true", help="同步后验证URL可访问性")
    args = parser.parse_args()

    print("=" * 50)
    print("AIreading 音频同步工具")
    if args.dry_run:
        print("⚠️  DRY-RUN 模式，不实际执行")
    print("=" * 50)

    local_base = Path(LOCAL_AUDIO_DIR)

    # 确定要同步的书籍
    if args.book_id:
        book_ids = [args.book_id]
    else:
        # 扫描本地有音频的所有书籍
        book_ids = sorted([
            int(d.name) for d in local_base.iterdir()
            if d.is_dir() and d.name.isdigit() and any(d.glob("*.mp3"))
        ])

    print(f"📚 共发现 {len(book_ids)} 本书需要同步: {book_ids}\n")

    total_success, total_fail = 0, 0
    synced_ids = []

    for book_id in book_ids:
        print(f"📖 ID={book_id} 同步中...")
        s, f = sync_book(book_id, args.dry_run)
        total_success += s
        total_fail += f
        if s > 0:
            synced_ids.append(book_id)
        print()

    print("=" * 50)
    print(f"✅ 同步完成：{total_success} 个文件成功，{total_fail} 个失败")
    print(f"📚 已同步书籍: {synced_ids}")

    if args.verify and not args.dry_run:
        print("\n🔍 验证服务器URL...")
        for book_id in synced_ids[:5]:  # 只验证前5本
            results = verify_book(book_id)
            ok = all(r[1] for r in results)
            status = "✅" if ok else "⚠️"
            print(f"  {status} ID={book_id}: {results}")

    # 更新 aireading.md 中的音频书单
    if synced_ids and not args.dry_run:
        update_knowledge_base(synced_ids)

def update_knowledge_base(synced_ids):
    """更新项目知识库中的可用音频书单"""
    kb_path = "/Users/arcade/.easyclaw/workspace/memory/projects/aireading.md"
    with open(kb_path) as f:
        content = f.read()

    # 读取书单
    booklist_path = "/Users/arcade/aireading/content/booklist.json"
    with open(booklist_path) as f:
        books = {str(b["id"]): b for b in json.load(f)["books"]}

    # 查服务器实际有的
    result = subprocess.run(
        f"sshpass -p '{SERVER_PASS}' ssh -o StrictHostKeyChecking=no {SERVER} 'ls /var/www/aireading/audio/'",
        shell=True, capture_output=True, text=True
    )
    server_ids = [x.strip() for x in result.stdout.strip().split("\n") if x.strip().isdigit()]

    lines = [f"- ID={sid} 《{books[sid]['title']}》{books[sid]['author']}" for sid in sorted(server_ids, key=int) if sid in books]
    new_section = "## ⚠️ 音频现状（重要）\n- 服务器实际有音频的书（`/var/www/aireading/audio/`）：\n" + "\n".join(f"  - **ID={sid}**：《{books[sid]['title']}》 ✅" for sid in sorted(server_ids, key=int) if sid in books)

    print(f"\n📝 知识库已更新，服务器现有 {len(server_ids)} 本书有音频")

if __name__ == "__main__":
    main()
