var path = require('path');
var fs = require('fs');
var http = require('http');
var test = require('tape');
var crawlLinks = require('../../lib/crawlLinks');

test('should crawl all links in the links array', function (t) {
	t.plan(1);

	var server = http.createServer(function (req, resp) {
		var filename = path.join(__dirname, '..', 'fixtures', req.url);
		fs.exists(filename, function (exists) {
			if (exists) {
				resp.writeHead(200, { 'Content-Type': 'text/html' });
				fs.createReadStream(filename).pipe(resp);
			} else {
				resp.writeHead(404, 'Not found', { 'Content-Type': 'text/html' });
				resp.end();
			}
		});
	});

	server.listen(3000, function (err) {
		if (err) {
			t.end(err);
		} else {
			var links = [
				'http://localhost:3000/b.html',
				'http://localhost:3000/c.html'
			];
			crawlLinks(links, function (error, scrapeResult) {
				t.deepEquals(scrapeResult, [{
					title: 'Page B',
					url: 'http://localhost:3000/b.html',
					headings: {
						h1: ['This is a page'],
						h2: ['This is a section', 'This is <strong>BIG</strong>']
					}
				},{
					title: 'Page A',
					url: 'http://localhost:3000/a.html',
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
				},{
					url: 'http://localhost:3000/d.html',
					notFound: true
				}]);

				server.close();
			});
		}
	});
});