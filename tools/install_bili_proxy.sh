#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# TVBox B站 Cookie 代理 —— Termux 一键安装 + 启动
# 用法（在 Termux 里粘贴执行）：
#   curl -L -o ~/install_bili.sh https://raw.githubusercontent.com/Bensonliu666/tvbox-config/main/tools/install_bili_proxy.sh && bash ~/install_bili.sh
# ============================================================
set -e

echo ""
echo "=============================================="
echo " TVBox B站 Cookie 代理 · 一键安装"
echo "=============================================="
echo ""

# 1. 安装依赖（python / requests / qrcode）
echo "[1/3] 安装运行环境（python + 依赖）..."
pkg update -y -q
pkg install -y -q python
pip install -q requests qrcode 2>/dev/null || pip install requests qrcode

# 2. 下载主服务脚本
echo "[2/3] 下载服务脚本..."
URL="https://raw.githubusercontent.com/Bensonliu666/tvbox-config/main/tools/bili_cookie_proxy.py"
if ! curl -fsSL -o ~/bili_proxy.py "$URL"; then
  echo "  raw 地址失败，尝试镜像..."
  curl -fsSL -o ~/bili_proxy.py "https://github.moeyy.xyz/$URL" || {
    echo "  下载失败。请检查网络后重试。"
    exit 1
  }
fi

# 3. 启动
echo "[3/3] 启动服务..."
echo ""
echo "=============================================="
echo " 服务启动后："
echo " 1) 手机浏览器打开  http://127.0.0.1:9978"
echo " 2) 用 B 站 App 扫码，页面变「已登录」"
echo " 3) 回 TVBox 重新加载配置，B 站源即可播放"
echo "=============================================="
echo ""
python ~/bili_proxy.py
