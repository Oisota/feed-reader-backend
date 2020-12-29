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
			.where(builder => {
				if (opts.saved) {
					builder.where({
						userId: opts.userId,
						saved: true,
					});
				} else {
					builder.where({
						userId: opts.userId,
					});
				}
			})
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
				id: opts.id,
				userId: opts.userId,
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
				id: opts.id,
				userId: opts.userId,
			})
			.delete();
	} catch (err) {
		console.log(err);
	}
	return result;
};
