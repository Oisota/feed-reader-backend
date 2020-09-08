const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

async function getDb() {
	const db = await open({
		filename: './data/app.db',
		driver: sqlite3.Database,
	});
	return db;
}

module.exports = getDb;
