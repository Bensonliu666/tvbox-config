// SA视频 lsjys11.com
var rule = {
    title: 'SA视频',
    host: 'https://www.lsjys11.com',
    url: '/movie/list?cat_id=fyclass&page=(fypage+1)',
    searchUrl: '/search?wd=fykey',
    class_name: '电影$电视剧$综艺$动漫',
    class_url: '1$2$3$4',
    一级: '.movie-item;a&&title;.movie-item img&&data-src;.video-item img&&src;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.detail-pic img&&data-src;.movie-pic img&&src',
        desc: '.detail-desc&&Text;.sketch&&Text',
        tabs: '.play-list h3&&Text',
        lists: '.play-list a&&Text;.play-list a&&href',
    },
}
