const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const CashSessionModel = sequelize.define('CashSession', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  openedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Cajero Principal',
  },
  closedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  openingAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 5000.0, // Fondo de caja inicial
  },
  closingAmountReal: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  expectedCash: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  expectedCard: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  expectedMP: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  expectedTransfer: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  differenceCash: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'open', // 'open' | 'closed'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  openedAt: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => new Date().toLocaleString(),
  },
  closedAt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = CashSessionModel;
