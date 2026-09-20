// 奈飞工厂 netflixgc.com - 苹果CMS自定义模板
var rule = {
    title: '奈飞工厂',
    host: 'https://www.netflixgc.com',
    url: '/vodshow/fyclass-----------(fypage+1).html',
    searchUrl: '/vodsearch/fykey-------------.html',
    class_name: '电影$连续剧$漫剧$综艺$纪录片',
    class_url: '1$2$3$23$24',
    一级: '.module-poster-item;a&&title;.module-item-cover img&&data-src;.module-item img&&data-src;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.module-item-cover img&&data-src;.module-poster-item img&&data-src',
        desc: '.module-info-content&&Text;.sketch&&Text',
        tabs: '.module-pannel__head h3&&Text',
        lists: '.module-playlist a&&Text;.module-playlist a&&href',
    },
}
