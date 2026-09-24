#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TVBox B站 Cookie 代理服务 (Termux / 任意 Linux 可运行)
========================================================
作用：在 127.0.0.1:9978 提供 B 站 cookie 服务，兼容 TVBox jar 版 Bili 爬虫：
  - GET /proxy?do=ck                 -> 返回 "ok"（健康检查）
  - GET /file/TVBox/bili_cookie.txt  -> 返回 {"cookie":"SESSDATA=...;bili_jct=...;buvid3=..."}
  - GET /                             -> 网页：B站二维码扫码登录（手机浏览器打开 http://127.0.0.1:9978）
  - GET /refresh                      -> 重新生成二维码
  - GET /status                       -> 登录状态 JSON

使用：只需用 B 站 App 扫一次码，cookie 自动获取、自动保存、自动挂载；
      cookie 失效后服务自动检测并提示重新扫码，无需手动抓 cookie。

运行环境依赖：
    pip install requests qrcode
"""
import http.server
import json
import os
import re
import sys
import threading
import time
import socketserver

import requests

# 尝试导入 qrcode（SVG 输出，无需 Pillow）
try:
    import qrcode
    from qrcode.image.svg import SvgImage
except Exception:
    qrcode = None

HOST = "127.0.0.1"
PORT = 9978
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
COOKIE_FILE = os.path.join(BASE_DIR, "bili_cookie.txt")

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

STATE = {
    "cookie": "",        # 完整 cookie 串
    "qr_key": "",        # 二维码 key
    "qr_url": "",        # 二维码内容 url
    "status": "no_login",  # no_login | waiting | confirmed | ok | expired | error
    "msg": "等待扫码",
}


def log(*args):
    print(time.strftime("[%H:%M:%S]"), *args, flush=True)


# ---------------- B 站登录 ----------------
def gen_qrcode():
    """生成登录二维码，返回 url"""
    try:
        r = requests.get(
            "https://passport.bilibili.com/x/passport-login/web/qrcode/generate",
            headers={"User-Agent": UA}, timeout=10)
        d = r.json()
        if d.get("code") == 0:
            STATE["qr_key"] = d["data"]["qrcode_key"]
            STATE["qr_url"] = d["data"]["url"]
            STATE["status"] = "waiting"
            STATE["msg"] = "请用 B 站 App 扫码"
            log("[二维码] 已生成，等待扫码")
            return STATE["qr_url"]
        STATE["status"] = "error"
        STATE["msg"] = "二维码生成失败: %s" % d.get("message")
    except Exception as e:
        STATE["status"] = "error"
        STATE["msg"] = "二维码生成异常: %s" % e
    return ""


def poll_loop():
    """轮询扫码状态，登录成功即提取并保存 cookie"""
    while True:
        if STATE.get("qr_key") and STATE.get("status") in ("waiting", "confirmed"):
            try:
                r = requests.get(
                    "https://passport.bilibili.com/x/passport-login/web/qrcode/poll",
                    params={"qrcode_key": STATE["qr_key"]},
                    headers={"User-Agent": UA}, timeout=10)
                d = r.json()
                code = (d.get("data") or {}).get("code")
                if code == 0:  # 登录成功
                    ck = {k: v for k, v in r.cookies.items()}
                    parts = []
                    for k in ("SESSDATA", "bili_jct", "buvid3", "buvid4", "b_nut"):
                        if ck.get(k):
                            parts.append("%s=%s" % (k, ck[k]))
                    if not parts:
                        parts.append("buvid3=0879DFCE-E687-DB47-DCEF-2BE20B6DD7C043368infoc")
                    STATE["cookie"] = "; ".join(parts)
                    STATE["status"] = "ok"
                    STATE["msg"] = "登录成功，cookie 已保存"
                    save_cookie()
                    log("[登录] 成功，cookie 已写入 %s" % COOKIE_FILE)
                elif code == 86090:  # 二维码过期
                    log("[二维码] 已过期，重新生成")
                    gen_qrcode()
                elif code == 86038:  # 已扫码待确认
                    STATE["status"] = "confirmed"
                    STATE["msg"] = "已扫码，请在手机上确认"
            except Exception as e:
                log("[poll] 异常:", e)
        time.sleep(3)


def check_loop():
    """定期检查 cookie 有效性，失效则提示重新登录"""
    while True:
        if STATE.get("cookie"):
            try:
                r = requests.get(
                    "https://api.bilibili.com/x/web-interface/nav",
                    headers={"User-Agent": UA, "Cookie": STATE["cookie"]}, timeout=10)
                if r.json().get("code") != 0:
                    log("[cookie] 已失效，重新生成二维码")
                    STATE["status"] = "expired"
                    STATE["msg"] = "cookie 已失效，请重新扫码"
                    gen_qrcode()
            except Exception:
                pass
        time.sleep(1800)  # 30 分钟检查一次


def save_cookie():
    """把 cookie 写入 /file/TVBox/bili_cookie.txt 要求的 JSON 格式"""
    with open(COOKIE_FILE, "w", encoding="utf-8") as f:
        json.dump({"cookie": STATE["cookie"]}, f, ensure_ascii=False)


def cookie_json():
    return json.dumps({"cookie": STATE["cookie"]}, ensure_ascii=False)


def qr_svg():
    """返回二维码 SVG（无 qrcode 库时返回占位）"""
    if not qrcode or not STATE.get("qr_url"):
        return ""
    try:
        qr = qrcode.QRCode(border=2, box_size=8)
        qr.add_data(STATE["qr_url"])
        img = qr.make_image(image_factory=SvgImage)
        buf = img.to_string()
        if isinstance(buf, bytes):
            buf = buf.decode("utf-8")
        return buf
    except Exception as e:
        return "<!-- qr error: %s -->" % e


PAGE = """<!DOCTYPE html><html lang="zh"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>TVBox B站 Cookie 代理</title>
<style>
body{{font-family:system-ui,sans-serif;background:#0f1115;color:#e8e8e8;text-align:center;margin:0;padding:24px}}
.card{{background:#1a1d24;border-radius:16px;padding:24px;max-width:420px;margin:0 auto}}
h1{{font-size:20px;margin:0 0 4px}} .sub{{color:#8a93a6;font-size:13px;margin-bottom:16px}}
.status{{display:inline-block;padding:6px 14px;border-radius:20px;font-size:14px;margin-bottom:16px}}
.st-ok{{background:#173b24;color:#4ade80}} .st-waiting,.st-confirmed{{background:#3b2f12;color:#fbbf24}}
.st-no_login,.st-expired{{background:#3b1d1d;color:#f87171}} .st-error{{background:#3b1d1d;color:#f87171}}
.qr{{margin:12px auto}} svg{{width:260px;height:260px}}
.foot{{color:#5b6472;font-size:12px;margin-top:16px;line-height:1.7}}
a{{color:#60a5fa}} .btn{{display:inline-block;margin-top:12px;padding:10px 20px;background:#2563eb;color:#fff;border-radius:10px;text-decoration:none}}
</style></head><body>
<div class="card">
<h1>TVBox · B站 Cookie 代理</h1>
<div class="sub">127.0.0.1:9978 · 扫码登录后自动保存 cookie</div>
<div id="st" class="status">加载中…</div>
<div id="qrbox" class="qr">__QR__</div>
<div id="msg" style="font-size:14px;color:#c0c7d1;min-height:20px"></div>
<a class="btn" href="/refresh">重新生成二维码</a>
<div class="foot">用 B 站 App 扫上方二维码 → 手机确认登录<br>
成功后 TVBox 重新加载配置即可播放 B 站源<br>
cookie 失效时本页会自动出现新二维码</div>
</div>
<script>
function s(){fetch('/status').then(r=>r.json()).then(d=>{
 var st=document.getElementById('st'),msg=document.getElementById('msg');
 st.className='status st-'+d.status;
 var names={ok:'✓ 已登录',waiting:'等待扫码…',confirmed:'已扫码，请在手机确认',no_login:'未登录',expired:'cookie 已失效',error:'出错'};
 st.textContent=names[d.status]||d.status;
 msg.textContent=d.msg||'';
 if(d.status!=='ok'&&d.qr){document.getElementById('qrbox').innerHTML=d.qr}
}).catch(e=>{});
}
s();setInterval(s,3000);
</script></body></html>"""


class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _send(self, code, body, ctype):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = self.path.split("?")[0]
        try:
            if path == "/proxy" and "do=ck" in self.path:
                self._send(200, b"ok", "text/plain; charset=utf-8")
            elif path == "/file/TVBox/bili_cookie.txt":
                self._send(200, cookie_json().encode("utf-8"), "application/json; charset=utf-8")
            elif path == "/status":
                body = {"status": STATE["status"], "msg": STATE["msg"]}
                if STATE.get("qr_url"):
                    body["qr"] = qr_svg()
                self._send(200, json.dumps(body, ensure_ascii=False).encode("utf-8"),
                           "application/json; charset=utf-8")
            elif path == "/refresh":
                gen_qrcode()
                self._send(200, PAGE.replace("__QR__", qr_svg()).encode("utf-8"),
                           "text/html; charset=utf-8")
            elif path == "/":
                self._send(200, PAGE.replace("__QR__", qr_svg()).encode("utf-8"),
                           "text/html; charset=utf-8")
            else:
                self._send(404, b"404", "text/plain; charset=utf-8")
        except Exception as e:
            self._send(500, str(e).encode("utf-8"), "text/plain; charset=utf-8")


def main():
    # 恢复已有 cookie
    if os.path.exists(COOKIE_FILE):
        try:
            with open(COOKIE_FILE, "r", encoding="utf-8") as f:
                STATE["cookie"] = json.load(f).get("cookie", "")
            if STATE["cookie"]:
                STATE["status"] = "ok"
                STATE["msg"] = "已从本地恢复 cookie"
                log("[启动] 已恢复本地 cookie")
        except Exception:
            pass
    if not STATE["cookie"]:
        gen_qrcode()

    threading.Thread(target=poll_loop, daemon=True).start()
    threading.Thread(target=check_loop, daemon=True).start()

    class S(socketserver.ThreadingTCPServer):
        allow_reuse_address = True

    try:
        server = S((HOST, PORT), Handler)
    except OSError as e:
        log("[错误] 端口 %d 被占用：%s" % (PORT, e))
        sys.exit(1)

    log("=" * 50)
    log("TVBox B站 Cookie 代理已启动")
    log("  状态页   : http://%s:%d/" % (HOST, PORT))
    log("  cookie  : http://%s:%d/file/TVBox/bili_cookie.txt" % (HOST, PORT))
    log("  保持本窗口运行；TVBox 重新加载配置即可")
    log("=" * 50)
    server.serve_forever()


if __name__ == "__main__":
    main()
