require('dotenv').config({
	path: process.env.ENV_PATH,
});
const tasks = require('../services/tasks');

/*
 * Call the save feeds download function
 */
(async () => {

	try {
		await tasks.deleteOld();
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
	process.exit(0);

})();
