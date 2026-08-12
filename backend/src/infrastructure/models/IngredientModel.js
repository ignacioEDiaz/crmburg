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
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stockQuantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'unidades',
  },
  unitCost: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.50, // Costo unitario por unidad de medida
  },
  minStock: {
    type: DataTypes.FLOAT,
    defaultValue: 20,
  },
  maxStock: {
    type: DataTypes.FLOAT,
    defaultValue: 500,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'En Stock',
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastRestock: {
    type: DataTypes.STRING,
    defaultValue: 'Hoy, 08:30 AM',
  },
});

module.exports = IngredientModel;
