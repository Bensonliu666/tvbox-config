// 剧踪影院 juzong01.me - 苹果CMS stui模板
var rule = {
    title: '剧踪影院',
    host: 'https://www.juzong01.me',
    url: '/vodshow/fyclass-----------(fypage+1)/',
    searchUrl: '/vodsearch/fykey-------------/',
    class_name: '电影$剧集$综艺$动漫$动作片$喜剧片$爱情片$科幻片',
    class_url: '1$2$3$4$6$7$8$9',
    一级: '.stui-vodlist__box;a&&title;.stui-vodlist__thumb&&data-original;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.stui-content__thumb img&&data-original',
        desc: '.stui-content__desc&&Text;.sketch&&Text',
        tabs: '.stui-pannel__head h3&&Text',
        lists: '.stui-content__playlist a&&Text;.stui-content__playlist a&&href',
    },
}
