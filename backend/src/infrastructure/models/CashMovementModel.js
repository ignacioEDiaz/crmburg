const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const CashMovementModel = sequelize.define('CashMovement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cashSessionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false, // 'ingreso' | 'egreso' | 'retiro_parcial'
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authorizedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Cajero',
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => new Date().toLocaleString(),
  },
});

module.exports = CashMovementModel;
