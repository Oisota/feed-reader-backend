const { Router } = require('express');
const asyncMiddleware = require('express-async-middleware');

const AuthService = require('../services/auth');
const { authRequired } = require('../middleware');

const router = Router();

router.route('/login')
	.post(asyncMiddleware(async (req, res) => {
		let user;
		try {
			user = await AuthService.verify({
				email: req.body.email,
				password: req.body.password,
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
		if (!user) {
			const err = new Error('Bad Request');
			throw err;
		}
		res.cookie('userId', user.id);
		res.status(200);
		res.json({
			id: user.id,
			status: user.status,
			roles: Array.from(user.roles),
		});
	}));

router.route('/register')
	.post(asyncMiddleware(async (req, res) => {
		let result;
		try {
			result = await AuthService.register({
				email: req.body.email,
				password: req.body.password,
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
		res.status(204).end();
	}));

router.route('/logout')
	.all(authRequired)
	.post((req, res) => {
		res.clearCookie('userId');
		res.status(204).end();
	});

module.exports = router;
