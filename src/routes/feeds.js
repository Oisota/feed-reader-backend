const { Router } = require('express');
const asyncMiddleware = require('express-async-middleware');
const format = require('date-fns/format');

const FeedModel = require('../models/feed');

const router = Router();

/*
 * Get all feeds
 */
router.get('/subscriptions', asyncMiddleware(async (req, res) => {
	const db = await getDb();
	const subs = await db.all('select * from subscriptions');
	res.json({
		data: subs,
	});
}));

/*
 * Add new feed
 */
router.post('/subscriptions', asyncMiddleware(async (req, res) => {
	const db = await getDb();
	const result = await db.run('insert into subscriptions (url) values (:url)', {
		':url': req.body.feedUrl
	});
	console.log(result);
	res.status(201).end();
}));

/*
 * Delete feed by id
 */
router.delete('/subscriptions/:subId', asyncMiddleware(async (req, res) => {
	const db = await getDb();
	const result = await db.run('delete from subscriptions where id = :id', {
		':id': req.params.subId
	});
	console.log(result);
	res.status(204).end();
}));

module.exports = router;
