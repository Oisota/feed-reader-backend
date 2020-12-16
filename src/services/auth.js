/*
 * Auth service
 */

const argon2 = require('argon2');

const { db } = require('../database');

/**
 * Register a new user
 * @param {object} opts
 * @param {string} opts.email
 * @param {string} opts.password
 * @returns {Promise<object>} db result
 */
exports.register = async (opts) => {
	const hash = await argon2.hash(opts.password);
	const result = await db('user')
		.insert({email: opts.email, hash: hash});
	return result
};

/**
 * Verify user credentials, return user object if
 * credentials valid
 * @param {object} opts
 * @param {string} opts.email
 * @param {string} opts.password
 * @returns {Promise<object>} user object
 */
exports.verify = async (opts) => {
	const user = await db
		.select('id', 'hash')
		.from('user')
		.where({email: opts.email})
		.first();

	const verified = await argon2.verify(user.hash, opts.password);
	if (verified) {
		return user;
	} else {
		return null;
	}
};
