// models/Plan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Plan = sequelize.define('Plan', {
  imagePath: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Plan;
