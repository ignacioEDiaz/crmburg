const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const OfferModel = sequelize.define('Offer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  originalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  offerPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
  discountBadge: {
    type: DataTypes.STRING,
    defaultValue: '20% OFF',
  },
  image: {
    type: DataTypes.TEXT('long'),
  },
  description: {
    type: DataTypes.TEXT,
  },
});

module.exports = OfferModel;
