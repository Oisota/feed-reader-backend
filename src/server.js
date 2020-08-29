const util = require('util');

const express = require('express');
const asyncMiddleware = require('express-async-middleware');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const mustacheExpress = require('mustache-express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const format = require('date-fns/format');

const config = {
	PORT: 8080,
};

const app = express();

app.engine('.html', mustacheExpress());
app.set('view engine', '.html');
app.set('views', __dirname + '/views');

app.disable('x-powered-by');
app.disable('etag');
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('public'));

async function getDb() {
	const db = await open({
		filename: './data/app.db',
		driver: sqlite3.Database,
	});
	return db;
}

// main app routes
app.get('/', asyncMiddleware(async (req, res) => {
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
			i.saved = false;
			return i;
		});

	res.render('home', {
		items: data,
		prev: (nextPage - 2 > 0) ? `/?page=${nextPage - 2}` : '/',
		next: `/?page=${nextPage}`,
	});
}));

app.put('/items/:itemId/save', asyncMiddleware(async (req, res) => {
	res.status(204).end();
}));

app.listen(config.PORT, () => {
	console.log(`Listening on port: ${config.PORT}`);
});
