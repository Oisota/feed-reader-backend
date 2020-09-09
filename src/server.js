const util = require('util');

const express = require('express');
const asyncMiddleware = require('express-async-middleware');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const nunjucks = require('nunjucks');

const getDb = require('./database');
const items = require('./posts');
const subscriptions = require('./subscriptions');

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


// register app routes
app.use(items);
app.use(subscriptions);


app.listen(config.PORT, () => {
	console.log(`Listening on port: ${config.PORT}`);
});
