const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const asyncMiddleware = require('express-async-middleware');

const config = require('./config');
const userService = require('./services/user');

/*
 * setup middlware
 */
exports.register = (app) => {
	app.use(helmet());
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
exports.authRequired = asyncMiddleware(async (req, res, next) => {
	if (!req.cookies.userId) {
		const err = new Error('Unauthorized');
		err.statusCode = 401;
		throw err;
	}
	req.user = await userService.get({
		id: req.cookies.userId
	});
	if (!req.user.canLogin) {
		const err = new Error('Unauthorized');
		err.statusCode = 401;
		throw err;
	}
	next();
});

/**
 * Check if user has a given role
 * @param {string} role
 */
exports.hasRole = (role) => {
	return (req, res, next) => {
		if (!req.user.roles.has(role)) {
			const err = new Error('Unauthorized');
			err.statusCode = 401;
			throw err;
		}
		next();
	};
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
