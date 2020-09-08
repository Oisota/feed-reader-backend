const util = require('util');

const express = require('express');
const asyncMiddleware = require('express-async-middleware');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const nunjucks = require('nunjucks');

const getDb = require('./database');
const items = require('./posts');

const config = {
	PORT: 8080,
};

const app = express();
app.set('view engine', '.html');

nunjucks.configure('src/views', {
	express: app,
});

app.disable('x-powered-by');
app.disable('etag');
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('public'));


// main app routes
app.use(items);

app.get('/subscriptions', asyncMiddleware(async (req, res) => {
	const db = await getDb();
	const subs = await db.all('select * from subscriptions');
	res.render('subscriptions', {
		subscriptions: subs,
	});
}));
app.post('/subscriptions', asyncMiddleware(async (req, res) => {
	const db = await getDb();
	const result = await db.run('insert into subscriptions (url) values (:url)', {
		':url': req.body.feedUrl
	});
	console.log(result);
	res.status(201).end();
}));
app.delete('/subscriptions/:subId', asyncMiddleware(async (req, res) => {
	const db = await getDb();
	const result = await db.run('delete from subscriptions where id = :id', {
		':id': req.params.subId
	});
	console.log(result);
	res.status(204).end();
}));

app.get('/subscriptions/table', asyncMiddleware(async (req, res) => {
	const db = await getDb();
	const subs = await db.all('select * from subscriptions');
	res.render('subscriptions-table', {
		subscriptions: subs,
	});
}));

app.listen(config.PORT, () => {
	console.log(`Listening on port: ${config.PORT}`);
});
