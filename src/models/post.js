const { Sequelize, DataTypes } = require('sequelize');

const db = require('../database');
const User = require('./user');
const Feed = require('./feed');

class Post extends Sequelize.Model {}

Post.init({
	title: {
		type: Sequelize.STRING,
	},
	content: {
		type: DataTypes.TEXT,
	},
	url: {
		type: DataTypes.STRING,
	},
	pubDate: {
		type: DataTypes.DATE,
	},
	feedTitle: {
		type: DataTypes.TEXT,
	},
	feedUrl: {
		type: DataTypes.TEXT,
	},
	saved: {
		type: DataTypes.BOOLEAN,
	}
}, {
	sequelize: db.sequelize,
	underscored: true,
	freezeTableName: true,
});

// define relationships
User.hasMany(Post);
Post.belongsTo(User);

Feed.hasMany(Post);
Post.belongsTo(Feed);

module.exports = Post;
