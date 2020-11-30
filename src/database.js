const knex = require('knex');

const config = require('./config');

exports.db = knex({
	client: 'sqlite3',
	connection: {
		filename: config.DB_FILE,
	},
	useNullAsDefault: true,
});
