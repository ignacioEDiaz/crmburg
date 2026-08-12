const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const SupplierModel = sequelize.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Insumos Varios', // 'Carniceria' | 'Verduleria' | 'Bebidas' | 'Panaderia'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  balanceDue: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = SupplierModel;
