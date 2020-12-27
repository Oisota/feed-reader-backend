/*
 * Auth service
 */

const argon2 = require('argon2');

const { db } = require('../database');
const userService = require('./user');

/**
 * Register a new user
 * @param {object} opts
 * @param {string} opts.email
 * @param {string} opts.password
 * @returns {Promise<object>} db result
 */
exports.register = async (opts) => {
	const hash = await argon2.hash(opts.password);

	const status = await db('accountStatus')
		.first('id')
		.where({name: 'registered'});

	console.log(status);

	const role = await db('role')
		.first('id')
		.where({name: 'user'});

	console.log(role);

	await db.transaction(async trx => {
		const user = await trx('user')
			.insert({email: opts.email, hash: hash, statusId: status.id}, ['id']);
		await trx('userRole')
			.insert({userId: user[0], roleId: role.id});
	});
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
		return await userService.get({id: user.id});
	} else {
		return null;
	}
};
