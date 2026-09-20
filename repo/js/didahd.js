// 嘀嗒影视 didahd.xyz - 苹果CMS myui模板
var rule = {
    title: '嘀嗒影视',
    host: 'https://www.didahd.xyz',
    url: '/type/fyclass-(fypage+1).html',
    searchUrl: '/search/fykey-------------.html',
    class_name: '电影$电视剧$纪录片$动漫$综艺',
    class_url: '1$2$3$4$5',
    一级: '.myui-vodlist__box;a&&title;.myui-vodlist__thumb&&data-original;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.myui-content__thumb img&&data-original',
        desc: '.myui-content__desc&&Text;.sketch&&Text',
        tabs: '.myui-pannel__head h3&&Text',
        lists: '.myui-content__list a&&Text;.myui-content__list a&&href',
    },
}
