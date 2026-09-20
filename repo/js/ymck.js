// 影猫仓库 ymck.pro - 自定义模板
var rule = {
    title: '影猫仓库',
    host: 'https://www.ymck.pro',
    url: '/show/fyclass-----------(fypage+1).html',
    searchUrl: '/search.html?wd=fykey',
    class_name: '电影$连续剧$综艺$动漫',
    class_url: '1$2$3$4',
    一级: '.movie-list-item;a&&title;.movie-list-thumb&&data-src;.movie-list-pic img&&data-src;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.movie-detail-pic img&&data-src;.movie-detail-thumb img&&data-src',
        desc: '.movie-detail-desc&&Text;.sketch&&Text',
        tabs: '.movie-play-list h3&&Text',
        lists: '.movie-play-list a&&Text;.movie-play-list a&&href',
    },
}
