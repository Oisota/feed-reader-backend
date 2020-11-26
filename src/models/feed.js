const { Sequelize } = require('sequelize');

const db = require('../database');
const User = require('./user');

class Feed extends Sequelize.Model {}

Feed.init({
	url: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
}, {
	sequelize: db.sequelize,
	underscored: true,
	freezeTableName: true
});

// define relationships
User.hasMany(Feed);
Feed.belongsTo(User);

module.exports = Feed;
