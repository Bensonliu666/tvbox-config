// 网飞猫 drpy2 源 v8 - 测试版：不请求，直接返回硬编码数据
var rule = {
    title: '网飞猫',
    host: 'https://www.ncat25.com',
    class_name: '电影&连续剧&动漫&综艺纪录&短剧',
    class_url: '1&2&3&4&6',
    searchable: 1,
    quickSearch: 1,
    filterable: 0,
    limit: 30,

    一级: 'js:setResult([{vod_id:"123",vod_name:"测试影片1",vod_pic:"",vod_remarks:"HD"},{vod_id:"456",vod_name:"测试影片2",vod_pic:"",vod_remarks:"更新至10集"},{vod_id:"789",vod_name:"测试影片3",vod_pic:"",vod_remarks:"完结"}]);',
};
