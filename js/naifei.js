// 奈飞工厂备 naifei.fyi - 标准苹果CMS hl模板
var rule = {
    title: '奈飞工厂备',
    host: 'https://naifei.fyi',
    url: '/vod/show/id/fyclass-(fypage+1).html',
    searchUrl: '/vod/search.html?wd=fykey',
    class_name: '电影$电视剧$动漫$综艺$短剧',
    class_url: '1$2$3$4$20',
    一级: '.hl-item;a&&title;.hl-item-thumb&&data-original;.nf-item img&&data-src;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.hl-content__thumb img&&data-original;.nf-item img&&data-src',
        desc: '.hl-content__desc&&Text;.sketch&&Text',
        tabs: '.hl-pannel__head h3&&Text',
        lists: '.hl-content__playlist a&&Text;.hl-content__playlist a&&href',
    },
}
