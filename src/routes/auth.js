const { Router } = require('express');
const asyncMiddleware = require('express-async-middleware');
const argon2 = require('argon2');

const UserModel = require('../models/user');

const router = Router();

router.route('/login')
	.get((req, res) => {
		res.render('login');
	})
	.post(asyncMiddleware(async (req, res) => {
		const db = await getDb();
		const q = `
		SELECT id, email, hash
		FROM user
		WHERE email = :email;
		`;
		const email = req.body.email;
		const password = req.body.password;
		const data = {
			':email': email,
		};
		let user;
		try {
			user = await db.get(q, data);
		} catch (err) {
			console.log(err);
			throw err;
		}
		if (!user) {
			res.redirect(301, '/');
			return;
		}
		const valid = await argon2.verify(user.hash, password);
		if (valid) {
			res.cookie('userId', user.id);
		}
		res.redirect(301, '/');
	}));

router.route('/register')
	.get((req, res) => {
		res.render('register');
	})
	.post(asyncMiddleware(async (req, res) => {
		console.log(req.body);
		const email = req.body.email;
		const password = req.body.password;
		const hash = await argon2.hash(password);
		const q = `
		INSERT INTO user (
			email,
			hash
		) VALUES (
			:email,
			:hash
		);`;
		const db = await getDb();
		const data = {
			':email': email,
			':hash': hash
		};
		let row;
		try {
			row = await db.run(q, data);
		} catch (err) {
			console.log(err);
			throw err;
		}
		res.redirect('/login');
	}));

router.post('/logout', (req, res) => {
	res.clearCookie('userId');
	res.redirect('/');
});

module.exports = router;
