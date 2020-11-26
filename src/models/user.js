const { Sequelize } = require('sequelize');

const db = require('../database');

class UserModel extends Sequelize.Model {}

UserModel.init({
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
	hash: {
		type: Sequelize.STRING,
	},
}, {
	sequelize: db.sequelize,
	modelName: 'user',
	tableName: 'user',
	underscored: true,
});

module.exports = UserModel;
