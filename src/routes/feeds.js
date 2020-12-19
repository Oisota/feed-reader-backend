const { Router } = require('express');
const asyncMiddleware = require('express-async-middleware');

const FeedService = require('../services/feed');
const { authRequired } = require('../middleware');

const router = Router();

router.route('/users/:userId/feeds')
	.all(authRequired)
	/*
	 * Get all feeds
	 */
	.get(asyncMiddleware(async (req, res) => {
		const feeds = await FeedService.getAll({
			userId: req.params.userId,
		});
		res.json({
			data: feeds,
		});
	}))
	/*
	 * Add new feed
	 */
	.post(asyncMiddleware(async (req, res) => {
		const result = await FeedService.add({
			userId: req.params.userId,
			url: req.body.url,
		});
		console.log(result);
		res.status(201).end();
	}));

/*
 * Delete feed by id
 */
router.route('/users/:userId/feeds/:feedId')
	.all(authRequired)
	.delete(asyncMiddleware(async (req, res) => {
		const result = await FeedService.delete({
			id: req.params.feedId,
			userId: req.params.userId,
		});
		console.log(result);
		res.status(204).end();
	}));

module.exports = router;
