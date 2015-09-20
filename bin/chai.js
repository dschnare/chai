#!/usr/bin/env node

var crawl = require('..');


var args = process.argv.slice(2);
var url = args[0];

crawl(url, function (err, scrapeResult) {
	if (err) {
		throw err;
	} else {
		process.stdout.write(JSON.stringify(scrapeResult, null, 4));
	}
});
