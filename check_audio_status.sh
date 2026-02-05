#!/bin/bash

# 统计音频文件状态的脚本

echo "开始检查 50 本书的音频文件状态..."
echo ""

# 定义应该存在的音频文件
REQUIRED_FILES=("zh_short.mp3" "zh_medium.mp3" "zh_long.mp3" "en_short.mp3" "en_medium.mp3" "en_long.mp3")

# 统计变量
total_books=50
complete_books=0
incomplete_books=0

# 创建临时文件保存结果
TEMP_FILE=$(mktemp)

for i in {1..50}; do
    book_dir="public/audio/$i"
    
    if [ ! -d "$book_dir" ]; then
        echo "BOOK_$i|MISSING_DIR|目录不存在" >> $TEMP_FILE
        continue
    fi
    
    missing_count=0
    missing_files=""
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ ! -f "$book_dir/$file" ]; then
            missing_count=$((missing_count + 1))
            missing_files="$missing_files $file"
        fi
    done
    
    if [ $missing_count -eq 0 ]; then
        echo "BOOK_$i|COMPLETE|6/6" >> $TEMP_FILE
        complete_books=$((complete_books + 1))
    else
        present_count=$((6 - missing_count))
        echo "BOOK_$i|INCOMPLETE|$present_count/6|缺失:$missing_files" >> $TEMP_FILE
        incomplete_books=$((incomplete_books + 1))
    fi
done

# 输出结果
cat $TEMP_FILE
echo ""
echo "===== 统计摘要 ====="
echo "总书籍数: $total_books"
echo "完整: $complete_books"
echo "不完整: $incomplete_books"

# 清理临时文件
rm -f $TEMP_FILE
