var fs = require('fs');
var path = require('path');
var test = require('tape');
var enumerateLinks = require('../../lib/enumerateLinks');

test('should grab URLs from all <a> elements', function (t) {
	t.plan(1);

	var filename = path.join(__dirname, '../fixtures/c.html');
	fs.readFile(filename, { encoding: 'utf8' }, function (err, html) {
		if (err) {
			t.end(err);
		} else {
			var links = enumerateLinks('c.html', html);
			t.deepEquals(links.sort(), [
				'a.html',
				'b.html',
				'c.html',
				'd.html'
			]);
		}
	});
});