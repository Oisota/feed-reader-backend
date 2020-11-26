const axios = require('axios');
const xml2js = require('xml2js');

const FeedModel = require('../models/feed');
const PostModel = require('../models/posts');

/*
 * Download fresh data from feeds
 */
exports.downloadFeeds = async () => {
	const parser = new xml2js.Parser();

	const feeds = await FeedModel.findAll();

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
			const post = {
				pubDate: Math.floor((new Date(item.pubDate[0]).getTime()) / 1000),
				url: item.link[0],
				title: item.title[0],
				content: item.description[0],
				feedTitle: result.rss.channel[0].title[0],
				feedUrl: result.rss.channel[0].link[0],
			};

			// insert into db
			let newPost;
			try {
				newPost = await PostModel.create(post);
			} catch (err) {
				console.log(err);
				return;
			}

			console.log(`Post Created, Id: ${newPost.id}`);
		}
	}
};
