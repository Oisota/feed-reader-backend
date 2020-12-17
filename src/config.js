exports.PORT = process.env.PORT || 8081;
exports.COOKIE_SECRET = process.env.COOKIE_SECRET || 'go go power rangers';
exports.ENV = process.env.NODE_ENV;
exports.IN_PROD = process.env.NODE_ENV === 'production';
exports.DB_FILE = process.env.DB_FILE || './data/app.db';
