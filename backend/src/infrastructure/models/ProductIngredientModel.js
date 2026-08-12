const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const ProductIngredientModel = sequelize.define('ProductIngredient', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ingredientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantityRequired: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1,
  },
});

module.exports = ProductIngredientModel;
