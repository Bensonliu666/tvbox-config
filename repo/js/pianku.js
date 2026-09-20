// 片库 pianku.online - 苹果CMS自定义模板
var rule = {
    title: '片库',
    host: 'https://4k01.pianku.online',
    url: '/vodtype/fyclass-(fypage+1).html',
    searchUrl: '/vodsearch/fykey-------------.html',
    class_name: '电影$连续剧$综艺$动漫',
    class_url: '1$2$3$4',
    一级: '.vod-item;a&&title;.vod-item-thumb img&&src;.vod-item img&&src;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.vod-detail-pic img&&src;.vod-item img&&src',
        desc: '.vod-detail-desc&&Text;.sketch&&Text',
        tabs: '.vod-play-list h3&&Text',
        lists: '.vod-play-list a&&Text;.vod-play-list a&&href',
    },
}
