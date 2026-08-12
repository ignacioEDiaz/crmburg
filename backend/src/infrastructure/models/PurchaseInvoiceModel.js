const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const PurchaseInvoiceModel = sequelize.define('PurchaseInvoice', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  supplierName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pagada', // 'pagada' | 'pendiente'
  },
  itemsJson: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]',
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => new Date().toLocaleString(),
  },
});

module.exports = PurchaseInvoiceModel;
