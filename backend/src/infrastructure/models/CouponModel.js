const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const CouponModel = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    defaultValue: 'percentage',
  },
  discountValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  scope: {
    type: DataTypes.ENUM('all', 'product'),
    defaultValue: 'all',
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expirationType: {
    type: DataTypes.STRING,
    defaultValue: 'forever',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  maxUses: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = CouponModel;
