const { Router } = require('express');
const asyncMiddleware = require('express-async-middleware');

const FeedService = require('../services/feed');

const router = Router();

/*
 * Get all feeds
 */
router.get('/feeds', asyncMiddleware(async (req, res) => {
	const feeds = await FeedService.getAll();
	res.json({
		data: feeds,
	});
}));

/*
 * Add new feed
 */
router.post('/feeds', asyncMiddleware(async (req, res) => {
	const result = await FeedService.add({
		url: req.body.url,
	});
	console.log(result);
	res.status(201).end();
}));

/*
 * Delete feed by id
 */
router.delete('/feeds/:feedId', asyncMiddleware(async (req, res) => {
	const result = await FeedService.delete({
		id: req.params.feedId
	});
	console.log(result);
	res.status(204).end();
}));

module.exports = router;
