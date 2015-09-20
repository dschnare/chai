var fs = require('fs');
var path = require('path');
var test = require('tape');
var scrape = require('../../lib/scrape');

test('should grab title and headings', function (t) {
	t.plan(1);

	var filename = path.join(__dirname, '../fixtures/a.html');
	fs.readFile(filename, { encoding: 'utf8' }, function (err, html) {
		if (err) {
			t.fail(err.toString());
		} else {
			var data = scrape(html);
			t.deepEquals(data, {
				title: 'Page A',
				headings: {
					h1: ['This is a page'],
					h2: ['This is a section', 'This is <strong>BIG</strong>']
				}
			});
		}
	});
});