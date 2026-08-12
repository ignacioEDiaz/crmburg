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
    defaultValue: 'Cliente Mostrador',
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  waiter: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fulfillmentType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pos', // 'pos' | 'dinein' | 'takeaway' | 'delivery'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Efectivo', // 'Efectivo' | 'MercadoPago' | 'Tarjeta' | 'Transferencia' | 'Split'
  },
  splitDetailsJson: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  itemsSummary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  itemsJson: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]',
  },
  rawTotal: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  discountAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  discountReason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  cashAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  changeAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Aceptado', // 'Pendiente' | 'Aceptado' | 'EnPreparacion' | 'Listo' | 'Entregado' | 'Rechazado' | 'Anulado'
  },
  voidReason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  voidAuthorizedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cashSessionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  driverName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  couponCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => new Date().toLocaleString(),
  },
});

module.exports = OrderModel;
