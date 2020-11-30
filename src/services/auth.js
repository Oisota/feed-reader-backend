/*
 * Auth service
 */

const argon2 = require('argon2');

/*
 * Register a new user
 */
exports.register = async (opts) => {
	const hash = await argon2.hash(opts.password);
};

/*
 * Verify user credentials
 */
exports.verify = (opts) => {
};
