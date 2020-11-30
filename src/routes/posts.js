const { Router } = require('express');
const asyncMiddleware = require('express-async-middleware');

const PostService = require('../services/post');

const router = Router();

/*
 * Get all posts
 */
router.get('/posts', asyncMiddleware(async (req, res) => {

	const page = req.query.page ? Number(req.query.page) : 0;
	const nextPage = page + 1;
	const pageSize = 30;

	const items = await PostService.getAll({
		limit: pageSize,
		offset: page * pageSize
	});
	
	res.json({
		data: items,
		prev: (nextPage - 2 > 0) ? `/?page=${nextPage - 2}` : '/',
		next: `/?page=${nextPage}`,
	});
}));

/*
 * Save a post by id
 */
router.put('/posts/:postId/save', asyncMiddleware(async (req, res) => {
	const result = await PostService.save({
		id: req.params.postId,
	});
	if (result) {
		res.status(204);
	} else {
		res.status(500);
	}
	res.end();
}));

/*
 * Delete post by id
 */
router.delete('/posts/:postId', asyncMiddleware(async (req, res) => {
	const result = await PostService.delete({
		id: req.params.postId,
	});
	if (result) {
		res.status(204);
	} else {
		res.status(500);
	}
	res.end();
}));

module.exports = router;
