const OrderModel = require('../models/OrderModel');
const Order = require('../../domain/entities/Order');

class SequelizeOrderRepository {
  async findAll() {
    const orders = await OrderModel.findAll({ order: [['createdAt', 'DESC']] });
    return orders.map(o => new Order({ ...o.toJSON(), items: JSON.parse(o.itemsJson || '[]') }));
  }

  async findById(id) {
    const order = await OrderModel.findByPk(id);
    if (!order) return null;
    return new Order({ ...order.toJSON(), items: JSON.parse(order.itemsJson || '[]') });
  }

  async create(orderData) {
    const code = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsSummary = orderData.items ? orderData.items.map(i => `${i.quantity || 1}x ${i.name}`).join(', ') : 'Custom Burger Order';
    const itemsJson = JSON.stringify(orderData.items || []);
    
    const created = await OrderModel.create({
      code,
      customerName: orderData.customerName || 'Alex',
      customerAvatar: orderData.customerAvatar || null,
      itemsSummary,
      itemsJson,
      total: orderData.total,
      status: 'Pending',
      date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    });

    return new Order({ ...created.toJSON(), items: JSON.parse(created.itemsJson) });
  }

  async updateStatus(id, status) {
    const order = await OrderModel.findByPk(id);
    if (!order) return null;
    order.status = status;
    await order.save();
    return new Order({ ...order.toJSON(), items: JSON.parse(order.itemsJson || '[]') });
  }

  async getStats() {
    const orders = await OrderModel.findAll();
    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    const pending = orders.filter(o => o.status === 'Pending').length;
    return {
      totalOrders,
      revenue,
      pending,
      avgDelivery: 24,
    };
  }
}

module.exports = SequelizeOrderRepository;
