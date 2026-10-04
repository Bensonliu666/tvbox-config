// 无搜索
var rule = {
	title:'播客',
	host:'https://getpodcast.xyz',
	url: 'https://getpodcast.xyz',
	searchUrl: '',
	searchable:0,
	quickSearch:0,
	headers:{
		'User-Agent': 'PC_UA'
	},
	timeout:5000,
	class_name:'播客&人文&NEWS热点&影视与读书&教育&历史&音乐&情感&有声书',
	class_url:'0&1&2&3&4&5&6&7&8',
	cate_exclude:'',
	play_parse:true,
	lazy:`js:
		input = {jx:0, url:input, parse:0}
	`,
	limit:6,
	推荐: `js:
		var d = [];
		var html = request(HOST);
		var m = html.match(/window\.__INITIAL_DATA__ = (\{.*?\});\s*<\/script>/);
		if (m) {
			var data = JSON.parse(m[1]);
			var list = data.rightNow || data.featured || [];
			list.forEach(function(it) {
				d.push({
					title: it.title,
					pic_url: it.cover,
					desc: (it.author || '') + ' ' + (it.description || '').replace(/\n/g, ' ').slice(0, 60),
					url: it.rssUrl + '|' + it.title + '|' + it.cover
				});
			});
		}
		setResult(d);
	`,
	一级: `js:
		var d = [];
		var html = request(HOST);
		var m = html.match(/window\.__INITIAL_DATA__ = (\{.*?\});\s*<\/script>/);
		if (m) {
			var data = JSON.parse(m[1]);
			var list = data.featured || [];
			if (MY_CATE > 0) {
				var tagMap = {
					1: '社会与文化|人文',
					2: '热点|新闻',
					3: '图书|故事与小说|影视|电影|阅读|媒体',
					4: '教育|语言学习|课程',
					5: '历史',
					6: '音乐',
					7: '情感与人际关系|恋爱|情感',
					8: '有声书|故事|小说|儿童故事|故事奇谈'
				};
				var fs = (tagMap[MY_CATE] || '').split('|');
				if (fs.length > 0) {
					var filtered = list.filter(function(it) {
						return (it.tags || []).some(function(t) {
							return fs.some(function(f) { return t.indexOf(f) >= 0 });
						});
					});
					if (filtered.length >= 6) { list = filtered; }
				}
			}
			list.forEach(function(it) {
				d.push({
					title: it.title,
					pic_url: it.cover,
					desc: (it.author || '') + ' ' + (it.description || '').replace(/\n/g, ' ').slice(0, 60),
					url: it.rssUrl + '|' + it.title + '|' + it.cover
				});
			});
		}
		setResult(d);
	`,
	二级: `js:
		let purl = input.split('|')[0];
		let title = input.split('|')[1];
		let pic = input.split('|')[2];
		var html = request(purl);
		let d = [];
		VOD = {};
		VOD.vod_name = title;
		VOD.vod_pic = pic;
		if (typeof play_url === 'undefined') {
			var play_url = ''
		}
		let episodes = html.match(/<item>[\s\S]*?<\/item>/g) || [];
		let vod_play_url = episodes.map(function(it) {
			let ititle = (it.match(/<title>(.*?)<\/title>/) || ['', ''])[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
			let iurl = (it.match(/<enclosure[^>]*url="([^"]+)"/) || ['', ''])[1].replace(/&amp;/g, '&');
			return ititle + '$' + iurl
		}).join('#');
		VOD.vod_play_from = '道长在线';
		VOD.vod_play_url = vod_play_url
	`,
	搜索:'',
}
