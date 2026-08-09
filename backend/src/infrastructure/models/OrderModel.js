const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const OrderModel = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerAvatar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  itemsSummary: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemsJson: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING, // 'Pending', 'In Process', 'Sent', 'Delivered'
    defaultValue: 'Pending',
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = OrderModel;
