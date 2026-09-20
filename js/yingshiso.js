// 光速影视 yingshiso.link
var rule = {
    title: '光速影视',
    host: 'https://www.yingshiso.link',
    url: '/list/?fyclass-(fypage+1).html',
    searchUrl: '/search.php?wd=fykey',
    class_name: '电影$电视剧$综艺$动漫$短剧',
    class_url: '1$2$3$4$37',
    一级: '.video-item;a&&title;.video-item img&&data-src;.movie-item img&&data-src;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.video-pic img&&data-src;.detail-pic img&&src',
        desc: '.video-desc&&Text;.sketch&&Text',
        tabs: '.play-list h3&&Text',
        lists: '.play-list a&&Text;.play-list a&&href',
    },
}
