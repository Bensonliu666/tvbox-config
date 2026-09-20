// 雪落影视 xlys.me
var rule = {
    title: '雪落影视',
    host: 'https://xlys.me',
    url: '/movies/fyclass?page=(fypage+1)',
    searchUrl: '/search?wd=fykey',
    class_name: '动作$爱情$喜剧$科幻$恐怖$战争$武侠$魔幻',
    class_url: 'action$love$comedy$scifi$horror$war$wuxia$magic',
    一级: '.movies .item;a&&title;.movies img&&data-src;.movies img&&src;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.movie-pic img&&data-src;.detail-pic img&&src',
        desc: '.movie-desc&&Text;.sketch&&Text',
        tabs: '.play-list h3&&Text',
        lists: '.play-list a&&Text;.play-list a&&href',
    },
}
