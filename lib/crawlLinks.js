function crawlLinks(links, scrapeResult, callback) {
	// NOTE: We require at "runtime" to avoid cyclic dependencies.
	var crawl = require('./crawl');

	links = links.slice();

	if (arguments.length === 2) {
		callback = scrapeResult;
		scrapeResult = [];
	}

	function next() {
		if (links.length === 0) {
			callback(null, scrapeResult);
		} else {
			crawl(links.shift(), scrapeResult, function (err, data) {
				if (err) {
					callback(err);
				} else {
					next();
				}
			});
		}
	}

	next();
}

module.exports = crawlLinks;
