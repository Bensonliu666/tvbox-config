// 简云影视 jianyunys.com - 苹果CMS hl模板
var rule = {
    title: '简云影视',
    host: 'https://jianyunys.com',
    url: '/vodtype/fyclass-(fypage+1).html',
    searchUrl: '/vodsearch/fykey-------------.html',
    class_name: '连续剧$电影$动漫$综艺',
    class_url: 'lianxuju$dianying$dongman$zongyi',
    一级: '.hl-item;a&&title;.hl-item-thumb&&data-original;;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.hl-content__thumb img&&data-original;.hl-item-thumb&&data-original',
        desc: '.hl-content__desc&&Text;.sketch&&Text',
        tabs: '.hl-pannel__head h3&&Text',
        lists: '.hl-content__playlist a&&Text;.hl-content__playlist a&&href',
    },
}
