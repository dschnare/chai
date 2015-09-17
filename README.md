# Chai

Chai is a simple web crawler that scrapes relevant SEO data from each page it visits.


# Usage

    npm install chai -g
    chai http://mywebsite.com > crawl.json


# Scraping

Chai will scrape the following data from each page it visits.

- Page title
- All H1 values
- All H2 values

The scrape data written to `std.out` is a JSON array of objects with the following shape:

	{
		title,
		url,
		headings: {
			h1: [],
			h2: []
		}
	}

For URLs that respond with a `404` the scrape object has this shape:

	{
		url, notFound: true
	}


# Roadmap

- Expose way to filter out URLs to be crawled
- Expose way to customize the scraper
- Make it easier to identify 404 URLs
- Add option to control verbosity