/*
 * Post Repo
 */

const { db } = require('../database');

/*
 * Get all
 */
exports.getAll = async (opts) => {
	let result;
	try {
		result = await db
			.select('id', 'title', 'pubDate', 'description', 'url', 'feedTitle', 'feedUrl', 'saved')
			.from('post')
			.orderBy('pubDate', 'desc')
			.limit(opts.limit)
			.offset(opts.offset);
	} catch (err) {
		console.log(err);
	}
	return result;
};

/*
 * Set post saved flag
 */
exports.save = async (opts) => {
	let result;
	try {
		result = await db('post')
			.update({
				saved: true
			})
			.where({
				id: opts.id
			});
	} catch (err) {
		console.log(err);
	}
	return result;
};

/*
 * Delete post
 */
exports.delete = async (opts) => {
	let result;
	try {
		result = await db('post')
			.where({
				id: opts.id
			})
			.delete();
	} catch (err) {
		console.log(err);
	}
	return result;
};
