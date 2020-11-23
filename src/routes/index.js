const auth = require('./auth');
const posts = require('./posts');
const feeds = require('./feeds');

/*
 * register app routes
 */
exports.register = (app) => {
	app.use(auth);
	app.use(posts);
	app.use(feeds);
};
