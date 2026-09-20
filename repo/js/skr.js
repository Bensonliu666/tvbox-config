// 樱之空 skr1.cc:666 - 苹果CMS自定义模板
var rule = {
    title: '樱之空',
    host: 'https://skr.skr1.cc:666',
    url: '/vodtype/fyclass/(fypage+1)/',
    searchUrl: '/vodsearch/fykey-------------/',
    class_name: '日漫$国漫$美漫$桜漫$桜歌$桜剧',
    class_url: '46$47$85$1$3$32',
    一级: '.vodlist_item;a&&title;.vodlist_thumb&&data-original;.vod_item img&&data-src;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.vod_detail_pic img&&data-original;.vod_thumb img&&data-src',
        desc: '.vod_detail_desc&&Text;.sketch&&Text',
        tabs: '.vod_play_list h3&&Text',
        lists: '.vod_play_list a&&Text;.vod_play_list a&&href',
    },
}
