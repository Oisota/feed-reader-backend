const { Sequelize } = require('sequelize');

const db = require('../database');
const UserModel = require('./user');

class FeedModel extends Sequelize.Model {}

FeedModel.init({
	url: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
}, {
	sequelize: db.sequelize,
	modelName: 'feed',
	tableName: 'feed',
	underscored: true,
});

// define relationships
UserModel.hasMany(FeedModel);
FeedModel.belongsTo(UserModel);

module.exports = FeedModel;
