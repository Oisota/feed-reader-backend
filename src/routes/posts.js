const { Router } = require('express');
const asyncMiddleware = require('express-async-middleware');
const format = require('date-fns/format');

const PostModel = require('../models/post');

const router = Router();

/*
 * Get all posts
 */
router.get('/posts', asyncMiddleware(async (req, res) => {
	const db = await getDb();

	const page = req.query.page ? Number(req.query.page) : 0;
	const nextPage = page + 1;
	const pageSize = 25;
	const offset = page * pageSize

	const getItems = `
	select *
	from items
	order by pubDate desc
	limit ${pageSize};
	`;
	const getItemsOffset = `
	select *
	from items
	order by pubDate desc
	limit ${pageSize}
	offset :offset;
	`;
	let items;
	if (page > 0) {
		items = await db.all(getItemsOffset, offset);
	} else {
		items = await db.all(getItems);
	}
	const data = items
		.map(i => {
			i.pubDate = format(new Date(i.pubDate * 1000), "MMM do, yyyy 'at' h:mm a");
			return i;
		});

	res.render('home', {
		items: data,
		prev: (nextPage - 2 > 0) ? `/?page=${nextPage - 2}` : '/',
		next: `/?page=${nextPage}`,
	});
}));

/*
 * Save a post by id
 */
router.put('/posts/:postId/save', asyncMiddleware(async (req, res) => {
	const db = await getDb();
	const q = `
	update items
	set saved = 1
	where id = :id
	`;
	const result = await db.run(q, {':id': req.params.itemId});
	if (result.changes) {
		res.render('saved-button', {});
	} else {
		res.status(500).send();
	}
}));

/*
 * Delete post by id
 */
router.delete('/posts/:postId', asyncMiddleware(async (req, res) => {
	//TODO implement delete
	res.status(204).end();
}));

module.exports = router;
