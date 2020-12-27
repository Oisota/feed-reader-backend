const { Router } = require('express');
const asyncMiddleware = require('express-async-middleware');

const userService = require('../services/user');
const { authRequired, hasRole } = require('../middleware');

const router = Router();

router.route('/requests')
	.all(authRequired, hasRole('admin'))
	.get(asyncMiddleware(async (req, res) => {
		let users;
		try {
			users = await userService.getUnverified();
		} catch (err) {
			console.log(err);
			throw err;
		}
		res.json({
			data: users,
		});
	}));

router.route('/verify/:userId')
	.all(authRequired, hasRole('admin'))
	.put(asyncMiddleware(async (req, res) => {
		let result;
		try {
			result = await userService.setVerified({
				id: req.params.userId,
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
		res.status(204).end();
	}));

module.exports = router;
