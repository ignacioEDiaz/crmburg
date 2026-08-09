const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const ProductModel = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 4.8,
  },
  reviewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 120,
  },
  description: {
    type: DataTypes.TEXT,
  },
  isSpicy: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  image: {
    type: DataTypes.TEXT('long'),
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = ProductModel;
