// 独播库 dbku.tv - 苹果CMS myui模板
var rule = {
    title: '独播库',
    host: 'https://www.dbku.tv',
    url: '/vodtype/fyclass-(fypage+1).html',
    searchUrl: '/vodsearch/fykey.html',
    class_name: '电影$连续剧$综艺$动漫$陆剧$台泰剧$日韩剧$短剧',
    class_url: '1$2$3$4$13$14$15$21',
    一级: '.myui-vodlist__box;a&&title;.myui-vodlist__thumb&&data-original;;a&&href',
    二级: {
        title: 'h1.title&&Text',
        img: '.myui-content__thumb img&&data-original',
        desc: '.sketch.content&&Text',
        tabs: '默认线路',
        lists: '.myui-content__list a&&Text;.myui-content__list a&&href',
    },
}
