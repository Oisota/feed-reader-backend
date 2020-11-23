const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

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
