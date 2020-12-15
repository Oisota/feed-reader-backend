const auth = require('./auth');
const posts = require('./posts');
const feeds = require('./feeds');

/*
 * register app routes
 */
exports.register = (app) => {
	app.use('/api/v1/auth', auth);
	app.use('/api/v1', posts);
	app.use('/api/v1', feeds);
};
