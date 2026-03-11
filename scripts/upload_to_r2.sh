#!/bin/bash
# =====================================================
# AIreading 音频上传到 Cloudflare R2
# 使用方法:
#   ./scripts/upload_to_r2.sh           # 上传所有本地音频
#   ./scripts/upload_to_r2.sh zh 3      # 上传指定语言+书籍
# =====================================================

set -e

export CLOUDFLARE_ACCOUNT_ID="611e9807067b3f8f2636e58a9fd67c57"
export CLOUDFLARE_API_TOKEN="xherhEhVLLGy8eDZkWAee0EB8NmQJO5IsJ2X9dGo"
export PATH="$HOME/node-v22.21.0-darwin-arm64/bin:$PATH"

BUCKET="aireading-audio"
AUDIO_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/audio"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if ! command -v wrangler &> /dev/null; then
  echo -e "${RED}❌ 未找到 wrangler${NC}"
  exit 1
fi

upload_book() {
  local lang=$1
  local book_id=$2
  local src_dir="$AUDIO_DIR/$book_id"

  echo -e "${YELLOW}📤 [$lang] 书籍 ID:$book_id${NC}"
  for version in short long; do
    local file="$src_dir/${version}.m4a"
    if [ -f "$file" ]; then
      echo -n "   ${version}.m4a ... "
      wrangler r2 object put "$BUCKET/$lang/$book_id/${version}.m4a" \
        --file "$file" \
        --content-type "audio/mp4" \
        --remote 2>/dev/null
      echo -e "${GREEN}✅${NC}"
    else
      echo -e "   ${version}.m4a ... ${YELLOW}跳过（文件不存在）${NC}"
    fi
  done
}

if [ -n "$1" ] && [ -n "$2" ]; then
  upload_book "$1" "$2"
  exit 0
fi

echo -e "${YELLOW}🔍 扫描本地音频...${NC}\n"
for book_dir in "$AUDIO_DIR"/*/; do
  book_id=$(basename "$book_dir")
  [[ "$book_id" =~ ^[0-9]+$ ]] || continue
  ls "$book_dir"*.m4a &>/dev/null 2>&1 && upload_book "zh" "$book_id"
done

echo -e "\n${GREEN}🎉 全部上传完成！${NC}"
echo "验证: https://audio.aireading.com/zh/3/short.m4a"
