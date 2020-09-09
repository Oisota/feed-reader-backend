const { Router } = require('express');
const asyncMiddleware = require('express-async-middleware');
const format = require('date-fns/format');

const getDb = require('./database');

const router = Router();

router.get('/subscriptions', asyncMiddleware(async (req, res) => {
	const db = await getDb();
	const subs = await db.all('select * from subscriptions');
	res.render('subscriptions', {
		subscriptions: subs,
	});
}));

router.post('/subscriptions', asyncMiddleware(async (req, res) => {
	const db = await getDb();
	const result = await db.run('insert into subscriptions (url) values (:url)', {
		':url': req.body.feedUrl
	});
	console.log(result);
	res.status(201).end();
}));

router.delete('/subscriptions/:subId', asyncMiddleware(async (req, res) => {
	const db = await getDb();
	const result = await db.run('delete from subscriptions where id = :id', {
		':id': req.params.subId
	});
	console.log(result);
	res.status(204).end();
}));

router.get('/subscriptions/table', asyncMiddleware(async (req, res) => {
	const db = await getDb();
	const subs = await db.all('select * from subscriptions');
	res.render('subscriptions-table', {
		subscriptions: subs,
	});
}));

module.exports = router;
