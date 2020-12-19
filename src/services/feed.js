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
			.from('feed')
			.where({userId: opts.userId});
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
		userId: opts.userId,
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
				id: opts.id,
				userId: opts.userId,
			})
			.delete();
	} catch (err) {
		console.log(err);
	}
	return result;
};
