var cheerio = require('cheerio');


function scrape(html) {
	var $ = cheerio.load(html);
	var title = $('title').html().trim();

	var headings = {};
	$('h1,h2').each(function () {
		var list = headings[this.name] || [];
		list.push($(this).html().trim());
		headings[this.name] = list;
	});

	return { title: title, headings: headings };
}

module.exports = scrape;
