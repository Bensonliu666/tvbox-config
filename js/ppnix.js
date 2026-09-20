// PPnix ppnix.com
var rule = {
    title: 'PPnix',
    host: 'https://www.ppnix.com',
    url: '/movie/list?page=(fypage+1)',
    searchUrl: '/search?wd=fykey',
    class_name: '电影$电视剧',
    class_url: 'movie$tv',
    一级: '.list .item;a&&title;.list img&&data-src;.list img&&src;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.movie-pic img&&data-src;.detail-pic img&&src',
        desc: '.movie-desc&&Text;.sketch&&Text',
        tabs: '.play-list h3&&Text',
        lists: '.play-list a&&Text;.play-list a&&href',
    },
}
