const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const StockAdjustmentModel = sequelize.define('StockAdjustment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ingredientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ingredientName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false, // 'merma' | 'rotura' | 'vencimiento' | 'conteo_fisico'
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false, // Motivo obligatorio
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Admin',
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => new Date().toLocaleString(),
  },
});

module.exports = StockAdjustmentModel;
