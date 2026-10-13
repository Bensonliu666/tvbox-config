// 网飞猫 drpy2 源 v5 - 完全自定义请求，用 MY_CATE 构造 URL
var HOST = 'https://www.ncat25.com';
var UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';
var _ck = '';
var _token = '';

function _solve() {
    if (_ck) return;
    try {
        var html = request(HOST + '/');
        var m = html.match(/a0_0x2a54=\['([0-9A-F]{40})'/);
        if (!m) { _ck = 'ok'; return; }
        var h = m[1];
        var n1 = parseInt(h[0], 16);
        for (var i = 0; i < 20000000; i++) {
            var wa = CryptoJS.SHA1(h + i);
            var b1 = (wa.words[n1 >> 2] >>> (24 - (n1 % 4) * 8)) & 0xff;
            var b2 = (wa.words[(n1 + 1) >> 2] >>> (24 - ((n1 + 1) % 4) * 8)) & 0xff;
            if (b1 === 0xb0 && b2 === 0x0b) { _ck = h + i; break; }
        }
        var tm = html.match(/name="t" value="([^"]+)"/);
        if (tm) _token = tm[1];
    } catch (e) {}
}

function _getHtml(url) {
    _solve();
    if (url.charAt(0) === '/') url = HOST + url;
    fetch_params.headers['Cookie'] = 'cdndefend_js_cookie=' + _ck;
    fetch_params.headers['User-Agent'] = UA;
    fetch_params.headers['Referer'] = HOST + '/';
    return request(url);
}

function _parseList(html) {
    var d = [];
    var re = /<div class="module-item">\s*<a href="\/detail\/(\d+)\.html"[^>]*>[\s\S]*?<div class="v-item-bottom">\s*<span>\s*([^<]*?)\s*<\/span>[\s\S]*?<div class="v-item-title">([^<]*)<\/div>/g;
    var m;
    while ((m = re.exec(html)) !== null) {
        var vid = m[1], remarks = m[2].trim(), name = m[3].trim();
        var pm = m[0].match(/data-original="([^"]+)"/);
        var pic = pm ? pm[1] : '';
        if (pic && pic.indexOf('logo_placeholder') < 0 && pic.indexOf('vod_pc_static') < 0) {
            if (pic.charAt(0) === '/') pic = HOST + pic;
        } else { pic = ''; }
        d.push({ vod_id: vid, vod_name: name, vod_pic: pic, vod_remarks: remarks });
    }
    if (d.length === 0) {
        var re2 = /<a href="\/detail\/(\d+)\.html" class="search-result-item">[\s\S]*?<img[^>]+data-original="([^"]+)"[^>]*>[\s\S]*?alt="([^"]*)"/g;
        while ((m = re2.exec(html)) !== null) {
            d.push({ vod_id: m[1], vod_name: m[3], vod_pic: m[2], vod_remarks: '' });
        }
    }
    return d;
}

var rule = {
    title: '网飞猫',
    host: HOST,
    class_name: '电影&连续剧&动漫&综艺纪录&短剧',
    class_url: '1&2&3&4&6',
    homeUrl: '/',
    url: '/channel/fyclass.html',
    searchUrl: '/search?k=**&t=',
    searchable: 1,
    quickSearch: 1,
    filterable: 0,
    play_parse: true,
    limit: 30,

    一级: $js.toString(() => {
        _solve();
        var url;
        // 判断是首页、分类还是搜索
        if (typeof MY_CATE !== 'undefined' && MY_CATE) {
            // 分类页
            url = '/channel/' + MY_CATE + '.html';
        } else if (input && input.indexOf('/search?') >= 0) {
            // 搜索页
            if (!_token) { _solve(); }
            url = '/search?k=' + decodeURIComponent(input.split('k=')[1].split('&')[0]) + '&t=' + _token;
        } else {
            // 首页
            url = '/';
        }
        var html = _getHtml(url);
        setResult(_parseList(html));
    }),

    二级: $js.toString(() => {
        var url = input;
        if (url.charAt(0) === '/') url = HOST + url;
        var html = _getHtml(url);

        var name = '';
        var dm = html.match(/class="detail-title[^"]*"[^>]*>([\s\S]*?)<\/div>/);
        if (dm) {
            var rm = dm[1].match(/<strong[^>]*>([^<]{2,60})<\/strong>/g);
            if (rm) for (var i = 0; i < rm.length; i++) {
                var t = rm[i].replace(/<[^>]+>/g, '').trim();
                if (t && !/[a-zA-Z0-9]{2,}\./.test(t)) { name = t; break; }
            }
        }
        var pm = html.match(/data-original="(\/vod1\/vod\/cover\/[^"]+)"/);
        var pic = pm ? HOST + pm[1] : '';

        var info = {};
        var ir = /class="detail-info-row-side">([^<]*)<\/div>\s*<div class="detail-info-row-main">([\s\S]*?)<\/div>/g;
        var im;
        while ((im = ir.exec(html)) !== null) {
            var side = im[1].trim().replace(/[：:]$/, '');
            var main = im[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            info[side] = main;
        }

        var sources = html.match(/<span class="source-item-label">([^<]*)<\/span>/g) || [];
        for (var s = 0; s < sources.length; s++) sources[s] = sources[s].replace(/<[^>]+>/g, '').trim();

        var box = html.match(/<div class="episode-list-box-main[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/);
        var play_from = [], play_url = [];
        if (box && sources.length) {
            var lists = box[1].match(/<div class="episode-list[^"]*"[^>]*>([\s\S]*?)<\/div>/g) || [];
            for (var idx = 0; idx < Math.min(sources.length, lists.length); idx++) {
                var eps = lists[idx].match(/href="(\/play\/[^"]+)"[^>]*class="episode-item"[^>]*>\s*<span>([^<]*)<\/span>/g) || [];
                if (!eps.length) continue;
                var epsArr = [];
                for (var e = 0; e < eps.length; e++) {
                    var em = eps[e].match(/href="(\/play\/[^"]+)"[^>]*>\s*<span>([^<]*)<\/span>/);
                    if (em) epsArr.push(em[2].trim() + '$' + HOST + em[1]);
                }
                if (epsArr.length) {
                    play_from.push(sources[idx]);
                    play_url.push(epsArr.join('#'));
                }
            }
        }

        VOD = {
            vod_id: url.match(/\/detail\/(\d+)/) ? url.match(/\/detail\/(\d+)/)[1] : '',
            vod_name: name,
            vod_pic: pic,
            vod_remarks: info['备注'] || '',
            vod_year: (info['首映'] || '').substring(0, 4),
            vod_director: info['导演'] || '',
            vod_actor: info['演员'] || '',
            vod_content: '',
            vod_play_from: play_from.join('$$$'),
            vod_play_url: play_url.join('$$$')
        };
    }),

    lazy: $js.toString(() => {
        var h = { 'User-Agent': UA, 'Referer': HOST + '/' };
        var url = input;
        if (url.charAt(0) === '/') url = HOST + url;
        var html = _getHtml(url);
        var m = html.match(/playSource\s*=\s*\{\s*src:\s*"([^"]+)"/);
        if (m && m[1].indexOf('http') === 0) {
            input = { parse: 0, url: m[1], header: h };
        } else {
            input = { parse: 1, url: url, header: h };
        }
    })
};
