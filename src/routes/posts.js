const { Router } = require('express');
const asyncMiddleware = require('express-async-middleware');

const { authRequired } = require('../middleware');
const PostService = require('../services/post');

const router = Router();

/*
 * Get all posts
 */
router.route('/users/:userId/posts')
	.all(authRequired)
	.get(asyncMiddleware(async (req, res) => {
		const page = req.query.page ? Number(req.query.page) : 0;
		const nextPage = page + 1;
		const pageSize = 30;
		const saved = (req.query.saved || '').toLowerCase() === 'true'

		const items = await PostService.getAll({
			userId: req.params.userId,
			limit: pageSize,
			offset: page * pageSize,
			saved: saved,
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
router.route('/users/:userId/posts/:postId/save')
	.all(authRequired)
	.put(asyncMiddleware(async (req, res) => {
		const result = await PostService.save({
			id: req.params.postId,
			userId: req.params.userId,
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
router.route('/users/:userId/posts/:postId')
	.all(authRequired)
	.delete(asyncMiddleware(async (req, res) => {
		const result = await PostService.delete({
			id: req.params.postId,
			userId: req.params.userId,
		});
		if (result) {
			res.status(204);
		} else {
			res.status(500);
		}
		res.end();
	}));

module.exports = router;
