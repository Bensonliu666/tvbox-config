// IFN ifn.watch
var rule = {
    title: 'IFN',
    host: 'https://ifn.watch',
    url: '/list/fyclass?page=(fypage+1)',
    searchUrl: '/search?wd=fykey',
    class_name: '电影$电视剧$综艺$动漫',
    class_url: '1$2$3$4',
    一级: '.video-item;a&&title;.video-item img&&data-src;.movie-item img&&src;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.detail-pic img&&data-src;.movie-pic img&&src',
        desc: '.detail-desc&&Text;.sketch&&Text',
        tabs: '.play-list h3&&Text',
        lists: '.play-list a&&Text;.play-list a&&href',
    },
}
