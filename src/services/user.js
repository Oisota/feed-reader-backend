/*
 * User Service
 */

const { db } = require('../database');

/**
 * Get user object
 * @param {object} opts
 * @param {string} opts.id
 * @returns {Promise<object>} user object
 */
exports.get = async (opts) => {
	const user = await db('user')
		.join('accountStatus', 'user.statusId', '=', 'accountStatus.id')
		.first({
			id: 'user.id',
			email: 'user.email',
			status: 'accountStatus.name',
			canLogin: 'accountStatus.canLogin',
		})
		.where({'user.id': opts.id});

	const roles = await db('userRole')
		.join('role', 'userRole.roleId', '=', 'role.id')
		.select({
			name: 'role.name'
		})
		.where({'userRole.userId': opts.id});

	user.roles = new Set(roles.map(r => r.name));

	return user;
};

/**
 * Get unverified users
 */
exports.getUnverified = async (opts) => {
	const users = await db('user')
		.join('accountStatus', 'user.statusId', '=', 'accountStatus.id')
		.select({
			id: 'user.id',
			email: 'user.email',
			status: 'accountStatus.name',
			canLogin: 'accountStatus.canLogin',
		})
		.where({'accountStatus.name': 'registered'});

	return users;
};

/**
 * Set account to verified
 */
exports.setVerified = async (opts) => {
	const verified = await db('accountStatus')
		.first('id')
		.where({name: 'verified'});

	const result = await db('user')
		.where({id: opts.id})
		.update({statusId: verified.id});

	return result;
};
