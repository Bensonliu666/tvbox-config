// 奈菲影视 nfyingshi.com
var rule = {
    title: '奈菲影视',
    host: 'https://www.nfyingshi.com',
    url: '/movie/list/fyclass-(fypage+1).html',
    searchUrl: '/search?wd=fykey',
    class_name: '美剧$英剧$韩剧$真人秀$纪录片$热门电影',
    class_url: 'meiju$yingju$hanju$zongyi$jilu$dianying',
    一级: 'li.item;a&&title;li.item img&&data-original;li.item img&&data-src;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.movie-pic img&&data-src;.movie-detail img&&src',
        desc: '.movie-desc&&Text;.sketch&&Text',
        tabs: '.play-list h3&&Text',
        lists: '.play-list a&&Text;.play-list a&&href',
    },
}
