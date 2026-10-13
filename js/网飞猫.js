// 网飞猫 drpy2 源 v9 - 标准选择器格式 + 推荐字段
var rule = {
    title: '网飞猫',
    host: 'https://www.ncat25.com',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
        'Referer': 'https://www.ncat25.com/',
        'Cookie': 'cdndefend_js_cookie=3079CAD4656DF1B57139FEA4823E8EB4661E0A61120343'
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
    推荐: 'div.module-item;div.v-item-title&&Text;img&&data-original;div.v-item-bottom span&&Text;a&&href',
    一级: 'div.module-item;div.v-item-title&&Text;img&&data-original;div.v-item-bottom span&&Text;a&&href',
    二级: {
        title: 'div.detail-title strong&&Text',
        img: 'img&&data-original',
        desc: '.detail-info-row-main&&Text',
        content: '',
        tabs: 'span.source-item-label&&Text',
        lists: 'a.episode-item&&href',
        list_text: 'a.episode-item span&&Text'
    },
    lazy: 'js:var html=request(input);var m=html.match(/playSource\\s*=\\s*\\{\\s*src:\\s*"([^"]+)"/);if(m&&m[1].indexOf("http")===0){input={parse:0,url:m[1],header:{"User-Agent":"Mozilla/5.0","Referer":"https://www.ncat25.com/"}};}else{input={parse:1,url:input,header:{"User-Agent":"Mozilla/5.0","Referer":"https://www.ncat25.com/"}};}'
};
