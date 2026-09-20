// 歪比巴卜 wbbb1.com - 苹果CMS module-items模板
var rule = {
    title: '歪比巴卜',
    host: 'https://wbbb1.com',
    url: '/type/fyclass-(fypage+1).html',
    searchUrl: '/search/fykey-------------.html',
    class_name: '电影$连续剧$综艺$动漫',
    class_url: '1$2$3$4',
    一级: '.module-poster-item;a&&title;.module-item-cover img&&data-original;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.module-item-cover img&&data-original;.module-poster-item img&&data-original',
        desc: '.module-info-content&&Text;.sketch&&Text',
        tabs: '.module-pannel__head h3&&Text',
        lists: '.module-playlist a&&Text;.module-playlist a&&href',
    },
}
