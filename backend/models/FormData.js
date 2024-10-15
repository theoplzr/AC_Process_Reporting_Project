// models/FormData.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FormData = sequelize.define('FormData', {
  xCoordinate: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  yCoordinate: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = FormData;
