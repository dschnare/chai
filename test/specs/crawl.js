var path = require('path');
var fs = require('fs');
var http = require('http');
var test = require('tape');
var crawl = require('../../lib/crawl');

test('should crawl all links', function (t) {
	t.plan(1);

	var server = http.createServer(function (req, resp) {
		var filename = path.join(__dirname, '..', 'fixtures', req.url);
		resp.writeHead(200, { 'Content-Type': 'text/html' });
		fs.createReadStream(filename).pipe(resp);
	});

	server.listen(3000, function (err) {
		if (err) {
			t.end(err);
		} else {
			crawl('http://localhost:3000/a.html', function (error, scrapeResult) {
				t.deepEquals(scrapeResult, [{
					title: 'Page A',
					url: 'http://localhost:3000/a.html',
					headings: {
						h1: ['This is a page'],
						h2: ['This is a section', 'This is <strong>BIG</strong>']
					}
				},{
					title: 'Page B',
					url: 'http://localhost:3000/b.html',
					headings: {
						h1: ['This is a page'],
						h2: ['This is a section', 'This is <strong>BIG</strong>']
					}
				},{
					title: 'Page C',
					url: 'http://localhost:3000/c.html',
					headings: {
						h1: ['This is a page'],
						h2: ['This is a section', 'This is <strong>BIG</strong>']
					}
				}]);

				server.close();
			});
		}
	});
});