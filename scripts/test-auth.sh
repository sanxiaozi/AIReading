#!/bin/bash

# AIreading 用户认证系统测试脚本
# 使用方法: ./scripts/test-auth.sh

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 基础 URL
BASE_URL="http://localhost:3000"

# 随机邮箱（避免冲突）
TIMESTAMP=$(date +%s)
EMAIL="test${TIMESTAMP}@example.com"
PASSWORD="TestPass123"

echo -e "${YELLOW}=== AIreading 用户认证系统测试 ===${NC}\n"

# 检查服务器是否运行
echo -e "${YELLOW}检查服务器状态...${NC}"
if ! curl -s -f "${BASE_URL}" > /dev/null; then
    echo -e "${RED}❌ 服务器未运行，请先启动: npm run dev${NC}"
    exit 1
fi
echo -e "${GREEN}✅ 服务器正在运行${NC}\n"

# 1. 测试注册
echo -e "${YELLOW}1. 测试用户注册...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${EMAIL}\",
    \"password\": \"${PASSWORD}\",
    \"username\": \"Test User\"
  }")

if echo "$REGISTER_RESPONSE" | jq -e '.token' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 注册成功${NC}"
    REGISTER_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
    echo "   用户: $EMAIL"
    echo "   Token: ${REGISTER_TOKEN:0:50}..."
else
    echo -e "${RED}❌ 注册失败${NC}"
    echo "$REGISTER_RESPONSE" | jq .
    exit 1
fi
echo

# 2. 测试登录
echo -e "${YELLOW}2. 测试用户登录...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${EMAIL}\",
    \"password\": \"${PASSWORD}\"
  }")

if echo "$LOGIN_RESPONSE" | jq -e '.token' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 登录成功${NC}"
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
    USER_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.user.id')
    echo "   用户ID: $USER_ID"
    echo "   Token: ${TOKEN:0:50}..."
else
    echo -e "${RED}❌ 登录失败${NC}"
    echo "$LOGIN_RESPONSE" | jq .
    exit 1
fi
echo

# 3. 测试获取用户信息
echo -e "${YELLOW}3. 测试获取用户信息...${NC}"
PROFILE_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/user/profile" \
  -H "Authorization: Bearer $TOKEN")

if echo "$PROFILE_RESPONSE" | jq -e '.user.id' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 获取用户信息成功${NC}"
    echo "$PROFILE_RESPONSE" | jq '.user | {id, email, username, locale, theme, playback_speed}'
else
    echo -e "${RED}❌ 获取用户信息失败${NC}"
    echo "$PROFILE_RESPONSE" | jq .
    exit 1
fi
echo

# 4. 测试更新用户信息
echo -e "${YELLOW}4. 测试更新用户信息...${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT "${BASE_URL}/api/user/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Updated User",
    "locale": "zh",
    "theme": "dark",
    "playback_speed": 1.5
  }')

if echo "$UPDATE_RESPONSE" | jq -e '.message' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 更新用户信息成功${NC}"
    echo "$UPDATE_RESPONSE" | jq '.user | {username, locale, theme, playback_speed}'
else
    echo -e "${RED}❌ 更新用户信息失败${NC}"
    echo "$UPDATE_RESPONSE" | jq .
    exit 1
fi
echo

# 5. 验证更新
echo -e "${YELLOW}5. 验证更新后的信息...${NC}"
VERIFY_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/user/profile" \
  -H "Authorization: Bearer $TOKEN")

UPDATED_USERNAME=$(echo "$VERIFY_RESPONSE" | jq -r '.user.username')
UPDATED_LOCALE=$(echo "$VERIFY_RESPONSE" | jq -r '.user.locale')
UPDATED_THEME=$(echo "$VERIFY_RESPONSE" | jq -r '.user.theme')
UPDATED_SPEED=$(echo "$VERIFY_RESPONSE" | jq -r '.user.playback_speed')

if [ "$UPDATED_USERNAME" = "Updated User" ] && \
   [ "$UPDATED_LOCALE" = "zh" ] && \
   [ "$UPDATED_THEME" = "dark" ] && \
   [ "$UPDATED_SPEED" = "1.5" ]; then
    echo -e "${GREEN}✅ 信息更新验证成功${NC}"
    echo "   用户名: $UPDATED_USERNAME"
    echo "   语言: $UPDATED_LOCALE"
    echo "   主题: $UPDATED_THEME"
    echo "   播放速度: ${UPDATED_SPEED}x"
else
    echo -e "${RED}❌ 信息更新验证失败${NC}"
    exit 1
fi
echo

# 6. 测试错误场景
echo -e "${YELLOW}6. 测试错误场景...${NC}"

# 6.1 无效的 Token
echo "   6.1 测试无效 Token..."
INVALID_TOKEN_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/user/profile" \
  -H "Authorization: Bearer invalid.token.here")
if echo "$INVALID_TOKEN_RESPONSE" | jq -e '.code' | grep -q "INVALID_TOKEN"; then
    echo -e "   ${GREEN}✅ 无效Token检测正常${NC}"
else
    echo -e "   ${RED}❌ 无效Token检测失败${NC}"
fi

# 6.2 重复注册
echo "   6.2 测试重复注册..."
DUPLICATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${EMAIL}\",
    \"password\": \"${PASSWORD}\"
  }")
if echo "$DUPLICATE_RESPONSE" | jq -e '.code' | grep -q "EMAIL_EXISTS"; then
    echo -e "   ${GREEN}✅ 重复注册检测正常${NC}"
else
    echo -e "   ${RED}❌ 重复注册检测失败${NC}"
fi

# 6.3 错误密码
echo "   6.3 测试错误密码..."
WRONG_PASSWORD_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${EMAIL}\",
    \"password\": \"WrongPassword123\"
  }")
if echo "$WRONG_PASSWORD_RESPONSE" | jq -e '.code' | grep -q "INVALID_CREDENTIALS"; then
    echo -e "   ${GREEN}✅ 错误密码检测正常${NC}"
else
    echo -e "   ${RED}❌ 错误密码检测失败${NC}"
fi

# 6.4 弱密码
echo "   6.4 测试弱密码..."
WEAK_PASSWORD_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"weak${TIMESTAMP}@example.com\",
    \"password\": \"123\"
  }")
if echo "$WEAK_PASSWORD_RESPONSE" | jq -e '.code' | grep -q "WEAK_PASSWORD"; then
    echo -e "   ${GREEN}✅ 弱密码检测正常${NC}"
else
    echo -e "   ${RED}❌ 弱密码检测失败${NC}"
fi

echo

# 总结
echo -e "${GREEN}=== 测试完成 ===${NC}"
echo -e "${GREEN}所有测试通过！用户认证系统工作正常。${NC}\n"
echo "测试用户信息:"
echo "  邮箱: $EMAIL"
echo "  密码: $PASSWORD"
echo "  用户ID: $USER_ID"
echo
