var urlParse = require('url').parse;
var agent = require('superagent');
var enumerateLinks = require('./enumerateLinks');
var crawlLinks = require('./crawlLinks');
var scrape = require('./scrape');


function crawl(url, scrapeResult, callback) {
	if (arguments.length === 2) {
		callback = scrapeResult;
		scrapeResult = [];
	}

	if (url) {
		url = url.indexOf('http://') < 0 ? 'http://' + url : url;
		var ourl = urlParse(url);

		if (scrapeResult.some(function (data) {
			var durl = urlParse(data.url);
			return durl.host === ourl.host && durl.pathname === ourl.pathname;
		})) {
			callback(null, scrapeResult);
			return;
		}

		// console.log('crawling:', url)
		agent.get(url).end(function (err, resp) {
			if (err) {
				if (err.status === 404) {
					scrapeResult.push({
						url: url,
						notFound: true
					});
					callback(null, scrapeResult);
				} else {
					callback(err);
				}
			} else if (resp.type.indexOf('text/html') >= 0) {
				var data = scrape(resp.text);
				data.url = url;
				scrapeResult.push(data);

				var links = enumerateLinks(url, resp.text);
				crawlLinks(links, scrapeResult, function (error) {
					if (error) {
						callback(error);
					} else {
						callback(null, scrapeResult);
					}
				});
			} else {
				callback(null, scrapeResult);
			}
		});
	} else {
		callback(new Error('Please provide a URL to crawl.'));
	}
}

module.exports = crawl;
