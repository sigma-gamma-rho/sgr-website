angular.module('rssService', []).factory('rss', function(){

	var feedParser = require('ortoo-feedparser');
	var url = "https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&output=rss";

	var rss = feedParser.parseUrl(url).on('article' , function(article){
	
		console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
		console.log(article.date);
		console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
	});
	return rss;
});