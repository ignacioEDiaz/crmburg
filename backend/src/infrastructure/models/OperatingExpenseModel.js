const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const OperatingExpenseModel = sequelize.define('OperatingExpense', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Servicios', // 'Alquiler' | 'Servicios' | 'Sueldos' | 'Mantenimiento' | 'Otros'
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Efectivo',
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => new Date().toLocaleString(),
  },
});

module.exports = OperatingExpenseModel;
