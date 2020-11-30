const saveFeeds = require('../services/save-feeds');

/*
 * Call the save feeds download function
 */
(async () => {

	try {
		await saveFeeds.download();
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
	process.exit(0);

})();
