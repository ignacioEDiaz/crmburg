const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const AuditLogModel = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Usuario',
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false, // 'anulacion_pedido' | 'descuento_manual' | 'ajuste_stock' | 'reapertura_caja'
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false, // Motivo obligatorio para auditoría
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => new Date().toLocaleString(),
  },
});

module.exports = AuditLogModel;
