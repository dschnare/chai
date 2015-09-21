var path = require('path');
var fs = require('fs');
var http = require('http');
var test = require('tape');
var crawl = require('../../lib/crawl');

test('should crawl all links', function (t) {
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
			crawl('http://localhost:3000/a.html', function (error, scrapeResult) {
				if (error) {
					t.end(error);
					return;
				}

				t.equals(scrapeResult.length, 4);
				t.deepEquals(scrapeResult[0], {
					title: 'Page A',
					url: 'http://localhost:3000/a.html',
					headings: {
						h1: ['This is a page'],
						h2: ['This is a section', 'This is <strong>BIG</strong>']
					}
				});
				t.deepEquals(scrapeResult[1], {
					title: 'Page B',
					url: 'http://localhost:3000/b.html',
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
				t.deepEquals(scrapeResult[3], {
					url: 'http://localhost:3000/d.html',
					notFound: true
				});

				server.close();
			});
		}
	});
});

test('should throw an error when server returns 5xx status', function (t) {
	t.plan(1);

	var server = http.createServer(function (req, resp) {
		resp.writeHead(500, { 'Content-Type': 'text/html' });
		resp.end();
	});

	server.listen(4000, function (err) {
		if (err) {
			t.end(err);
		} else {
			crawl('http://localhost:4000/500.html', function (error) {
				if (error) {
					t.notEqual(error.status, 404, 'Crawl should throw with status 5xx.');
				} else {
					t.fail(error.toString());
				}

				server.close();
			});
		}
	});
});

test('should throw an error if no URL is specified', function (t) {
	t.plan(1);
	crawl('', function (err) {
		if (err) {
			t.equals(err.status, 500, 'Crawl should throw with status 500.');
		} else {
			t.fail('Crawl did not throw as expected.');
		}
	});
});

test('should throw when indirect page throws', function (t) {
	t.plan(1);

	var server = http.createServer(function (req, resp) {
		var filename = path.join(__dirname, '..', 'fixtures', req.url);
		fs.exists(filename, function (exists) {
			if (exists) {
				resp.writeHead(200, { 'Content-Type': 'text/html' });
				fs.createReadStream(filename).pipe(resp);
			} else if (req.url.indexOf('500.html') >= 0) {
				resp.writeHead(500, { 'Content-Type': 'text/html' });
				resp.end();
			} else {
				resp.writeHead(404, 'Not found', { 'Content-Type': 'text/html' });
				resp.end();
			}
		});
	});

	server.listen(3333, function (err) {
		if (err) {
			t.end(err);
		} else {
			crawl('http://localhost:3333/e.html', function (error, data) {
				if (error) {
					t.notEqual(error.status, 404, 'Crawl should throw with status 5xx.');
				} else {
					process.stdout.write(JSON.stringify(data));
					t.fail('Crawl did not throw as expected.');
				}

				server.close();
			});
		}
	});
});