var path = require('path');
var fs = require('fs');
var http = require('http');
var test = require('tape');
var crawlLinks = require('../../lib/crawlLinks');

function pluck (o, keys) {
	var obj = {};
	for (var k = 0, len = keys.length; k < len; k += 1) {
		if (keys[k] in o) {
			obj[keys[k]] = o[keys[k]];
		}
	}
	return obj;
}

test('should crawl all links in the links array', function (t) {
	t.plan(5);

	var server = http.createServer(function (req, resp) {
		var filename = path.join(__dirname, '..', 'fixtures', req.url);
		fs.exists(filename, function (exists) {
			if (exists) {
				resp.writeHead(200, { 'Content-Type': 'text/html' });
				fs.createReadStream(filename).pipe(resp);
			} else if (req.url.indexOf('.pdf') > 0) {
				resp.writeHead(200, { 'Content-Type': 'application/pdf' });
				resp.end();
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
				if (error) {
					t.end(error);
					return;
				}

				t.equals(scrapeResult.length, 4);
				t.deepEquals(scrapeResult[0], {
					title: 'Page B',
					url: 'http://localhost:3000/b.html',
					headings: {
						h1: ['This is a page'],
						h2: ['This is a section', 'This is <strong>BIG</strong>']
					}
				});
				t.deepEquals(scrapeResult[1], {
					title: 'Page A',
					url: 'http://localhost:3000/a.html',
					headings: {
						h1: ['This is a page'],
						h2: ['This is a section', 'This is <strong>BIG</strong>']
					}
				});
				t.deepEquals(scrapeResult[2], {
					title: 'Page C',
					url: 'http://localhost:3000/c.html',
					headings: {
						h1: ['This is a page'],
						h2: ['This is a section', 'This is <strong>BIG</strong>']
					}
				});
				t.deepEquals(pluck(scrapeResult[3], ['url', 'statusCode']), {
					url: 'http://localhost:3000/d.html',
					statusCode: 404
				});

				server.close();
			});
		}
	});
});

test('should crawl all links in the links array', function (t) {
	t.plan(1);

	var server = http.createServer(function (req, resp) {
		resp.writeHead(500, 'Server error', { 'Content-Type': 'text/html' });
		resp.end();
	});

	server.listen(3000, function (err) {
		if (err) {
			t.end(err);
		} else {
			var links = [
				'http://localhost:3000/500.html'
			];
			crawlLinks(links, function (error, scrapeResult) {
				t.deepEquals(pluck(scrapeResult[0], ['url', 'statusCode']), {
					url: 'http://localhost:3000/500.html',
					statusCode: 500
				});
				server.close();
			});
		}
	});
});
