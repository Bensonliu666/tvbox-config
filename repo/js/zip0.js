// ZIP0 zip0.com
var rule = {
    title: 'ZIP0',
    host: 'https://zip0.com',
    url: '/category/fyclass?page=(fypage+1)',
    searchUrl: '/search?wd=fykey',
    class_name: '电影$短剧$电视剧$综艺$纪录片$体育',
    class_url: 'movie$short$tv$variety$documentary$sports',
    一级: 'a.poster;&&title;a.poster img&&data-src;a.poster img&&src;;&&href',
    二级: {
        title: 'h1&&Text',
        img: '.detail-pic img&&data-src;.movie-pic img&&src',
        desc: '.detail-desc&&Text;.sketch&&Text',
        tabs: '.play-list h3&&Text',
        lists: '.play-list a&&Text;.play-list a&&href',
    },
}
