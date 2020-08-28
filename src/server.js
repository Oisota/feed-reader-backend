const util = require('util');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const mustacheExpress = require('mustache-express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

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

// main app routes
app.get('/', async (req, res) => {
	const db = await open({
		filename: './data/app.db',
		driver: sqlite3.Database,
	});
	const items = await db.all('select * from items order by pubDate desc');
	//TODO format pubDate
	res.render('home', {
		items: items
	});
});

app.listen(config.PORT, () => {
	console.log(`Listening on port: ${config.PORT}`);
});
