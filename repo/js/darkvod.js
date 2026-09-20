// 黑夜影院 darkvod.com - 苹果CMS myui模板
var rule = {
    title: '黑夜影院',
    host: 'https://darkvod.com',
    url: '/video/fyclass/(fypage+1)/',
    searchUrl: '/search/fykey.html',
    class_name: '电影$连续剧$综艺$动漫$短剧',
    class_url: 'dianying$lianxuju$zongyi$dongman$duanju',
    一级: '.myui-vodlist__box;a&&title;.myui-vodlist__thumb&&data-original;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.myui-content__thumb img&&data-original',
        desc: '.myui-content__desc&&Text;.sketch&&Text',
        tabs: '.myui-pannel__head h3&&Text',
        lists: '.myui-content__list a&&Text;.myui-content__list a&&href',
    },
}
