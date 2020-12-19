const axios = require('axios');
const xml2js = require('xml2js');

const { db } = require('../database');

/*
 * Download fresh data from feeds
 */
exports.download = async () => {
	const parser = new xml2js.Parser();

	const feeds = await db.select('url').from('feed');

	for (const feed of feeds) {
		console.log(`Processing Feed: ${feed.url}`);

		// download feed
		let resp;
		try {
			resp = await axios.get(feed.url, {
				timeout: 5000, // 5 second
			});
		} catch (err) {
			console.log(err);
			continue;
		}

		// parse xml
		const result = await parser.parseStringPromise(resp.data);
		let items = [];
		try {
			items = result.rss.channel[0].item;
		} catch (e) {
			console.log(e);
			console.log(result);
			continue;
		}

		// insert posts into db
		for (const item of items) {
			// format object here
			const post = {
				pubDate: Math.floor((new Date(item.pubDate[0]).getTime()) / 1000),
				title: item.title[0],
				description: item.description[0],
				url: item.link[0],
				feedTitle: result.rss.channel[0].title[0],
				feedUrl: result.rss.channel[0].link[0],
				saved: false,
			};

			// insert into db
			let newPost;
			try {
				newPost = await db('post').insert(post);
			} catch (err) {
				if (err.errno === 19) {
					console.log('Duplicate post, skipping');
				} else {
					console.log(post);
					console.log(err);
				}
				continue;
			}

			console.log(`Post Created: ${newPost}`);
		}
	}
};

/*
 * delete old posts that have not been saved
 */
exports.deleteOld = async () => {
	const twoWeeks = 14 * 24 *  60 * 60 * 1000; // 2 weeks in milliseconds
	const pastDate = (new Date()).getTime() - twoWeeks // need to subtract 2 weeks from date
	let result;
	try {
		result = await db('post')
			.where('pubDate', '>', pastDate)
			.andWhere({saved: false})
			.del();
	} catch (err) {
		console.log(err);
		return;
	}
	console.log(result);
};
