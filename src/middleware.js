const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const asyncMiddleware = require('express-async-middleware');

const config = require('./config');

/*
 * setup middlware
 */
exports.register = (app) => {
	app.use(helmet({
		contentSecurityPolicy: false, //TODO figure correct settings
	}));
	app.use(cookieParser(config.COOKIE_SECRET, {
		secure: config.IN_PROD,
		httpOnly: config.IN_PROD,
		maxAge: 365 * 24 * 60 * 60,
		sameSite: true,
	}));
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(morgan(config.IN_PROD ? 'combined' : 'dev'));
};

/*
 * Auth Required Middleware
 */
exports.authRequired = (req, res, next) => {
	if (!req.cookies.userId) {
		const err = new Error('Unauthorized');
		err.statusCode = 401;
		throw err;
	}
	req.user = {
		id: req.cookies.userId,
	};
	next();
};

/*
 * Error Handling
 */
exports.errorHandler = (err, req, res, next) => {
	res.status(err.statusCode || 500);
	res.json({
		message: err.message || 'Internal Server Error',
	});
};
