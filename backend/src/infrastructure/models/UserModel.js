const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const UserModel = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'mozo', // 'admin' | 'supervisor' | 'cajero' | 'mozo' | 'cocina'
  },
  pin: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '1234', // PIN de 4 dígitos para autorización de acciones sensibles
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = UserModel;
