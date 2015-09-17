var urlParse = require('url').parse;
var cheerio = require('cheerio');


function enumerateLinks(url, html) {
	var $ = cheerio.load(html);
	var host = urlParse(url).host;

	return $('a').filter(function () {
		var $a = $(this);
		var href = $a.attr('href').trim();

		return (href && href !== '#' && href.indexOf('mailto') < 0 && href.indexOf('tel') < 0) &&
			(href.indexOf('/') === 0 || href.indexOf('http') < 0) ||
			(urlParse(href).host === host);
	}).map(function () {
		var href = $(this).attr('href').trim();

		if (href.indexOf('/') === 0) {
			return host + href;
		} else if (href.indexOf('http') < 0) {
			return host + '/' + href;
		}

		return href;
	}).get();
}

module.exports = enumerateLinks;
