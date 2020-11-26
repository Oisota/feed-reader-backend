const { Sequelize } = require('sequelize');

const db = require('../database');

class User extends Sequelize.Model {}

User.init({
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
	underscored: true,
	freezeTableName: true,
});

module.exports = User;
