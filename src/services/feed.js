/*
 * Feed Repo
 */

const { db } = require('../database');

/**
 * Get all feeds
 * @returns {Array<Object>} list of feeds
 */
exports.getAll = async (opts)  => {
	let result;
	try {
		result = await db
			.select('id', 'url')
			.from('feed');
	} catch (err) {
		console.log(err);
	}
	return result;
};

/*
 * Add feed
 */
exports.add = async (opts) => {
	const feed = {
		url: opts.url,
	};
	let result;
	try {
		result = await db('feed').insert(feed);
	} catch (err) {
		console.log(err);
	}
	return result;
};

/*
 * delete feed by id
 */
exports.delete = async (opts) => {
	let result;
	try {
		result = await db('feed')
			.where({
				id: opts.id
			})
			.delete();
	} catch (err) {
		console.log(err);
	}
	return result;
};
