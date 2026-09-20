// 饭搭子影视 fdzys.com - 苹果CMS movie-list模板
var rule = {
    title: '饭搭子影视',
    host: 'https://fdzys.com',
    url: '/vodtype/fyclass-(fypage+1).html',
    searchUrl: '/search?wd=fykey',
    class_name: '电影$连续剧$综艺$动漫',
    class_url: '1$2$3$4',
    一级: '.movie-item;a&&title;.movie-list-thumb img&&data-src;.movie-item img&&data-src;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.movie-detail-pic img&&data-src;.movie-item img&&data-src',
        desc: '.movie-detail-desc&&Text;.sketch&&Text',
        tabs: '.movie-play-list h3&&Text',
        lists: '.movie-play-list a&&Text;.movie-play-list a&&href',
    },
}
