// ============ 哔哩 · 直连 v1.0 ============
// 免代理、免登录 B 站源（TVBox v3 JS 源格式，不依赖 drpy2 / 9978 本地代理）
// 接口：搜索、热门榜、分区榜、详情、播放（mp4 直链 / DASH 兜底）
// 限制：匿名访问，登录才能看的高清/大会员内容不可用；清晰度自动降级到可用档
// 内置匿名身份（buvid3），格式符合 B 站要求即可，无需真实登录
var biliUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
var buvid3 = "0879DFCE-E687-DB47-DCEF-2BE20B6DD7C043368infoc";
var bNut = "1790278143";
var apiHost = "https://api.bilibili.com";
var webHost = "https://www.bilibili.com";
var header = {
    "User-Agent": biliUA,
    "Referer": webHost + "/",
    "Cookie": "buvid3=" + buvid3 + "; b_nut=" + bNut
};
// 分区 rid 表（ranking/v2 可用 rid）
var classes = {
    "0": "综合热门", "1": "动画", "13": "番剧", "167": "国创", "3": "音乐",
    "129": "舞蹈", "4": "游戏", "36": "科技", "188": "数码", "160": "生活",
    "119": "鬼畜", "155": "时尚", "5": "娱乐", "181": "影视", "17": "纪录片",
    "23": "电影", "11": "电视剧", "6": "知识", "138": "运动", "223": "汽车"
};

function req(url) {
    try {
        return fetch(url, { headers: header });
    } catch (e) {
        return "";
    }
}

function getJson(url) {
    var txt = req(url);
    if (!txt) return null;
    try { return JSON.parse(txt); } catch (e) { return null; }
}

function videoItem(v) {
    var pic = v.pic || "";
    if (pic.indexOf("http") !== 0) pic = "https:" + pic;
    var remark = "";
    if (v.duration) {
        var sec = parseInt(v.duration, 10) || 0;
        var hh = Math.floor(sec / 3600), mm = Math.floor((sec % 3600) / 60), ss = sec % 60;
        remark = (hh > 0 ? hh + ":" : "") + (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss;
    }
    if (v.owner && v.owner.name) remark = remark ? remark + " · " + v.owner.name : v.owner.name;
    if (v.stat && v.stat.view !== undefined && v.stat.view !== null) {
        var n = parseInt(v.stat.view, 10) || 0;
        var vs = n >= 10000 ? (n / 10000).toFixed(1) + "万" : "" + n;
        remark = remark ? remark + " · " + vs + "播放" : vs + "播放";
    }
    return { vod_id: v.bvid, vod_name: v.title || "", vod_pic: pic, vod_remarks: remark };
}

function homeContent() {
    var list = [];
    var j = getJson(apiHost + "/x/web-interface/index/top/feed/rcmd?ps=20&pn=1");
    if (j && j.code === 0 && j.data && j.data.item) {
        var arr = j.data.item;
        for (var i = 0; i < arr.length; i++) {
            var it = videoItem(arr[i]);
            if (it.vod_id) list.push(it);
        }
    }
    // 备选：rcmd 失败时用 popular
    if (list.length === 0) {
        var j2 = getJson(apiHost + "/x/web-interface/popular?ps=20&pn=1");
        if (j2 && j2.code === 0 && j2.data && j2.data.list) {
            var arr2 = j2.data.list;
            for (var k = 0; k < arr2.length; k++) {
                var it2 = videoItem(arr2[k]);
                if (it2.vod_id) list.push(it2);
            }
        }
    }
    return JSON.stringify({ code: 0, msg: "", page: 1, pagecount: 1, limit: 20, list: list });
}

function categoryContent(tid, pg) {
    var page = parseInt(pg, 10) || 1;
    var rid = "0";
    if (tid && classes[tid]) rid = tid;
    var list = [];
    var j = getJson(apiHost + "/x/web-interface/index/top/feed/rcmd?ps=20&pn=" + page + "&rid=" + rid);
    if (j && j.code === 0 && j.data && j.data.item) {
        var arr = j.data.item;
        for (var i = 0; i < arr.length; i++) {
            var it = videoItem(arr[i]);
            if (it.vod_id) list.push(it);
        }
    }
    // 备选：分区推荐失败时退回综合
    if (list.length === 0) {
        var j2 = getJson(apiHost + "/x/web-interface/index/top/feed/rcmd?ps=20&pn=" + page);
        if (j2 && j2.code === 0 && j2.data && j2.data.item) {
            var arr2 = j2.data.item;
            for (var k = 0; k < arr2.length; k++) {
                var it2 = videoItem(arr2[k]);
                if (it2.vod_id) list.push(it2);
            }
        }
    }
    return JSON.stringify({ code: 0, msg: "", page: page, pagecount: 10, limit: 20, list: list });
}

function searchContent(key) {
    var list = [];
    var j = getJson(apiHost + "/x/web-interface/search/type?search_type=video&keyword=" + encodeURIComponent(key) + "&page=1");
    if (j && j.code === 0 && j.data && j.data.result) {
        var arr = j.data.result;
        for (var i = 0; i < arr.length; i++) {
            var v = arr[i];
            var pic = v.pic || "";
            if (pic.indexOf("http") !== 0) pic = "https:" + pic;
            var remark = v.author || "";
            if (v.play !== undefined) {
                var n = parseInt(v.play, 10) || 0;
                var ps = n >= 10000 ? (n / 10000).toFixed(1) + "万" : "" + n;
                remark = remark ? remark + " · " + ps + "播放" : ps + "播放";
            }
            list.push({ vod_id: v.bvid, vod_name: v.title ? v.title.replace(/<em[^>]*>/g, "").replace(/<\/em>/g, "") : "", vod_pic: pic, vod_remarks: remark });
        }
    }
    return JSON.stringify({ code: 0, msg: "", page: 1, pagecount: 1, limit: 20, list: list });
}

function detailContent(ids) {
    var id = ids[0];
    if (!id) return JSON.stringify({ list: [] });
    var bvid = id.split("+")[0];
    var j = getJson(apiHost + "/x/web-interface/view?bvid=" + bvid);
    if (!j || j.code !== 0 || !j.data) return JSON.stringify({ list: [] });
    var d = j.data;
    var pic = d.pic || "";
    if (pic.indexOf("http") !== 0) pic = "https:" + pic;
    var playUrls = [], playFrom = [];
    // 播放 id 约定：bvid+cid（playerContent 里 split("+") 还原）
    var pages = (d.pages && d.pages.length) ? d.pages : [{ cid: d.cid }];
    var eps = [];
    for (var i = 0; i < pages.length; i++) {
        eps.push("P" + (i + 1) + "$" + bvid + "+" + pages[i].cid);
    }
    var vod = {
        vod_id: bvid,
        vod_name: d.title || "",
        vod_pic: pic,
        vod_year: d.pubdate ? new Date(d.pubdate * 1000).getFullYear() : "",
        vod_remarks: d.duration ? "时长" + Math.floor((d.duration || 0) / 60) + "分" : "",
        vod_actor: d.owner ? d.owner.name : "",
        vod_director: d.tname || "",
        vod_content: d.desc || "",
        type_name: d.tname || "哔哩",
        vod_play_from: "直链$$$DASH",
        vod_play_url: eps.join("#") + "$$$" + eps.join("#")
    };
    return JSON.stringify({ list: [vod] });
}

function buildMpd(videoList, audioList, duration) {
    // 参考 CatVod Bili 实现的 MPD 拼接；dash 字段为 snake_case（segment_base）
    var body = "", adap = "";
    for (var i = 0; i < videoList.length; i++) {
        var v = videoList[i];
        var sb = v.segment_base || v.SegmentBase || {};
        var mime = v.mimeType || v.mime_type || "video/mp4";
        var cw = v.width || 1920, ch = v.height || 1080;
        adap += '<AdaptationSet mimeType="' + mime + '" segmentAlignment="true" startWithSAP="1">';
        adap += '<Representation id="v' + i + '" bandwidth="' + (v.bandwidth || 1000000) + '" codecs="' + (v.codecs || "") + '" width="' + cw + '" height="' + ch + '">';
        adap += '<BaseURL>' + (v.baseUrl || v.base_url) + '</BaseURL><SegmentBase indexRange="' + (sb.index_range || "") + '" timescale="' + (sb.timescale || 1) + '"><Initialization range="' + (sb.initialization || "") + '"/></SegmentBase></Representation></AdaptationSet>';
    }
    for (var i2 = 0; i2 < audioList.length; i2++) {
        var a = audioList[i2];
        var sb2 = a.segment_base || a.SegmentBase || {};
        adap += '<AdaptationSet mimeType="' + (a.mimeType || a.mime_type || "audio/mp4") + '" segmentAlignment="true" startWithSAP="1">';
        adap += '<Representation id="a' + i2 + '" bandwidth="' + (a.bandwidth || 100000) + '" codecs="' + (a.codecs || "") + '" audioSamplingRate="44100">';
        adap += '<BaseURL>' + (a.baseUrl || a.base_url) + '</BaseURL><SegmentBase indexRange="' + (sb2.index_range || "") + '" timescale="' + (sb2.timescale || 1) + '"><Initialization range="' + (sb2.initialization || "") + '"/></SegmentBase></Representation></AdaptationSet>';
    }
    body = '<?xml version="1.0" encoding="UTF-8"?><MPD xmlns="urn:mpeg:dash:schema:mpd:2011" profiles="urn:mpeg:dash:profile:isoff-on-demand:2011" type="static" mediaPresentationDuration="PT' + duration + 'S" minBufferTime="PT1.5S"><Period duration="PT' + duration + 'S" start="PT0S">' + adap + '</Period></MPD>';
    return body;
}

function playerContent(ids) {
    var id = ids[0];
    if (!id) return JSON.stringify({ code: 200, msg: "", url: "" });
    var parts = id.split("+");
    var bvid = parts[0], cid = parts[1] || "";
    // 尝试直链（fnval=0, qn 降级）
    var qns = [64, 32, 16];
    for (var i = 0; i < qns.length; i++) {
        var u = apiHost + "/x/player/playurl?bvid=" + bvid + "&cid=" + cid + "&qn=" + qns[i] + "&fnval=0&fourk=1";
        var j = getJson(u);
        if (j && j.code === 0 && j.data && j.data.durl && j.data.durl.length) {
            var url = j.data.durl[0].url;
            return JSON.stringify({ code: 200, msg: "", url: url, header: header });
        }
    }
    // DASH 兜底（fnval=4048 拼 MPD）
    var j2 = getJson(apiHost + "/x/player/playurl?bvid=" + bvid + "&cid=" + cid + "&qn=64&fnval=4048&fourk=1");
    if (j2 && j2.code === 0 && j2.data && j2.data.dash && j2.data.dash.video && j2.data.dash.video.length) {
        var dash = j2.data.dash;
        var dur = j2.data.dash.duration || 0;
        var mpd = buildMpd(dash.video, dash.audio || [], dur);
        return JSON.stringify({ code: 200, msg: "", url: "data:text/plain;base64," + base64(mpd), header: header });
    }
    return JSON.stringify({ code: 200, msg: "播放地址获取失败", url: "" });
}

function base64(str) {
    // 简易 base64（TVBox 环境一般有全局 btoa，这里兜底）
    try { return btoa(str); } catch (e) {
        var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var r = "", i = 0, c1, c2, c3, e1, e2, e3, e4;
        var bytes = [];
        for (var k = 0; k < str.length; k++) bytes.push(str.charCodeAt(k));
        while (i < bytes.length) {
            c1 = bytes[i++]; c2 = bytes[i++]; c3 = bytes[i++];
            e1 = c1 >> 2; e2 = ((c1 & 3) << 4) | (c2 >> 4); e3 = ((c2 & 15) << 2) | (c3 >> 6); e4 = c3 & 63;
            if (isNaN(c2)) { e3 = e4 = 64; } else if (isNaN(c3)) { e4 = 64; }
            r += t.charAt(e1) + t.charAt(e2) + t.charAt(e3) + t.charAt(e4);
        }
        return r;
    }
}

exports.homeContent = homeContent;
exports.categoryContent = categoryContent;
exports.searchContent = searchContent;
exports.detailContent = detailContent;
exports.playerContent = playerContent;
