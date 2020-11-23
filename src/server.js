const express = require('express');

const config = require('./config');
const middlware = require('./middleware');
const routes = require('./routes');

const app = express();

// app setup
app.disable('x-powered-by');
app.disable('etag');

// register middlware
middlware.register(app)

// register app routes
routes.register(app);

app.listen(config.PORT, () => {
	console.log(`Listening on port: ${config.PORT}`);
});
