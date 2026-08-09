const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const IngredientModel = sequelize.define('Ingredient', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'un',
  },
  maxStock: {
    type: DataTypes.INTEGER,
    defaultValue: 500,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'En Stock',
  },
  lastRestock: {
    type: DataTypes.STRING,
    defaultValue: 'Hoy, 08:30 AM',
  },
});

module.exports = IngredientModel;
