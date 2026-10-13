// ============ 网飞猫（ncat25）drpy2 源 v3 ============
// 文件加载时先解 cdndefend 挑战，cookie 写入 headers
var HOST = 'https://www.ncat25.com';
var UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';
var _ck = '';
var _token = '';

// 文件加载时立即解挑战
try {
    var _html0 = request(HOST + '/');
    var _m0 = _html0.match(/a0_0x2a54=\['([0-9A-F]{40})'/);
    if (_m0) {
        var _h = _m0[1];
        var _n1 = parseInt(_h[0], 16);
        for (var _i = 0; _i < 20000000; _i++) {
            var _wa = CryptoJS.SHA1(_h + _i);
            var _b1 = (_wa.words[_n1 >> 2] >>> (24 - (_n1 % 4) * 8)) & 0xff;
            var _b2 = (_wa.words[(_n1 + 1) >> 2] >>> (24 - ((_n1 + 1) % 4) * 8)) & 0xff;
            if (_b1 === 0xb0 && _b2 === 0x0b) { _ck = _h + _i; break; }
        }
        var _tm = _html0.match(/name="t" value="([^"]+)"/);
        if (_tm) _token = _tm[1];
    } else {
        _ck = 'ok';
    }
} catch (e) {}

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
    headers: {
        'User-Agent': UA,
        'Referer': HOST + '/',
        'Cookie': 'cdndefend_js_cookie=' + _ck
    },
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
        // input 是引擎请求后返回的 HTML（已带 cookie，应是真实页面）
        var html = input;
        // 如果还是挑战页，fallback 重新请求
        if (html && (html.indexOf('a0_0x2a54') >= 0 || html.indexOf('cdndefend') >= 0)) {
            fetch_params.headers['Cookie'] = 'cdndefend_js_cookie=' + _ck;
            html = request(HOST + '/');
        }
        var d = _parseList(html);
        setResult(d);
    }),

    二级: $js.toString(() => {
        var url = input;
        if (url && url.charAt(0) === '/') url = HOST + url;
        fetch_params.headers['Cookie'] = 'cdndefend_js_cookie=' + _ck;
        var html = request(url);

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
        fetch_params.headers['Cookie'] = 'cdndefend_js_cookie=' + _ck;
        var h = { 'User-Agent': UA, 'Referer': HOST + '/' };
        var url = input;
        if (url && url.charAt(0) === '/') url = HOST + url;
        var html = request(url);
        var m = html.match(/playSource\s*=\s*\{\s*src:\s*"([^"]+)"/);
        if (m && m[1].indexOf('http') === 0) {
            input = { parse: 0, url: m[1], header: h };
        } else {
            input = { parse: 1, url: url, header: h };
        }
    })
};
