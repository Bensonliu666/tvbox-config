// 豆花电影网 dhvideo.cc
var rule = {
    title: '豆花电影网',
    host: 'https://dhvideo.cc',
    url: '/movie/list/fyclass-(fypage+1).html',
    searchUrl: '/s?wd=fykey',
    class_name: '电影$电视剧$综艺$动漫',
    class_url: 'movie$tv$variety$anime',
    一级: '.movie-item;a&&title;.movie-item img&&data-src;.video-item img&&data-src;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.movie-pic img&&data-src;.detail-pic img&&src',
        desc: '.movie-desc&&Text;.sketch&&Text',
        tabs: '.play-list h3&&Text',
        lists: '.play-list a&&Text;.play-list a&&href',
    },
}
