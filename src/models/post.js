const { Sequelize, DataTypes } = require('sequelize');

const db = require('../database');
const UserModel = require('./user');
const FeedModel = require('./feed');

class PostModel extends Sequelize.Model {}

PostModel.init({
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
	modelName: 'feed',
	tableName: 'feed',
	underscored: true,
});

// define relationships
UserModel.hasMany(PostModel);
PostModel.belongsTo(UserModel);

FeedModel.hasMany(PostModel);
PostModel.belongsTo(FeedModel);

module.exports = FeedModel;
