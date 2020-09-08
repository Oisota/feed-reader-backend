/*
 * Script to run periodically in order to load data
 * from feeds and populate the DB with updated feed data
 */

const axios = require('axios');
const xml2js = require('xml2js');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

(async () => {

	const parser = new xml2js.Parser();
	const db = await open({
		filename: './data/app.db',
		driver: sqlite3.Database,
	});

	const feeds = await db.all('select * from subscriptions');

	for (const feed of feeds) {
		const resp = await axios.get(feed.url);
		const result = await parser.parseStringPromise(resp.data);
		let items = [];
		try {
			items = result.rss.channel[0].item;
		} catch (e) {
			console.log(e);
			console.log(result);
			continue;
		}
		for (const item of items) {
			// format object here
			const data = {
				':pubDate': Math.floor((new Date(item.pubDate[0]).getTime()) / 1000),
				':link': item.link[0],
				':title': item.title[0],
				':description': item.description[0],
				':feedTitle': result.rss.channel[0].title[0],
				':feedLink': result.rss.channel[0].link[0],
			};

			// insert into sqlite DB here
			const q = `
			INSERT INTO items(
				pubDate,
				link,
				title,
				description,
				feedTitle,
				feedLink
			) VALUES (
				:pubDate,
				:link,
				:title,
				:description,
				:feedTitle,
				:feedLink
			);`;

			let row;
			try {
				row = await db.run(q, data);
			} catch (err) {
				console.log(err);
				return;
			}

			console.log(`Inserted Row, id: ${row.lastID}`);
		}
	}

})();
