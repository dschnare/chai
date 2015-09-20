var path = require('path');
var fs = require('fs');
var http = require('http');
var test = require('tape');
var crawl = require('../../lib/crawl');

test('should crawl all links', function (t) {
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
				},
				{
					url: 'http://localhost:3000/d.html',
					notFound: true
				}]);

				server.close();
			});
		}
	});
});

test('should throw an error if no URL is specified', function (t) {
	t.plan(1);
	crawl('', function (err) {
		if (err) {
			t.pass();
		} else {
			t.fail(err.toString());
		}
	});
});