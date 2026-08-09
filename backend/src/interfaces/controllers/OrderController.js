const OrderModel = require('../../infrastructure/models/OrderModel');
const ProductModel = require('../../infrastructure/models/ProductModel');
const IngredientModel = require('../../infrastructure/models/IngredientModel');
const ProductIngredientModel = require('../../infrastructure/models/ProductIngredientModel');

class OrderController {
  async getAll(req, res) {
    try {
      const orders = await OrderModel.findAll({ order: [['createdAt', 'DESC']] });
      const result = orders.map(o => ({
        ...o.toJSON(),
        items: JSON.parse(o.itemsJson || '[]')
      }));
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const code = `#PED-${Math.floor(1000 + Math.random() * 9000)}`;
      const items = req.body.items || [];
      const itemsSummary = items.map(i => `${i.qty || 1}x ${i.name}`).join(', ');
      
      const created = await OrderModel.create({
        code,
        customerName: req.body.customerName || 'Alex',
        customerAvatar: req.body.customerAvatar || null,
        itemsSummary,
        itemsJson: JSON.stringify(items),
        total: req.body.total,
        status: 'Pendiente',
        date: 'Hoy, ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      });

      res.status(201).json({ ...created.toJSON(), items });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async acceptOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderModel.findByPk(id);
      if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

      if (order.status === 'Aceptado') {
        return res.json({ message: 'El pedido ya fue aceptado previamente', order });
      }

      order.status = 'Aceptado';
      await order.save();

      // Automatic Stock Deduction Logic!
      const items = JSON.parse(order.itemsJson || '[]');
      const deductions = [];

      for (const item of items) {
        const product = await ProductModel.findOne({ where: { name: item.name } });
        if (product) {
          const recipes = await ProductIngredientModel.findAll({ where: { productId: product.id } });
          const itemQty = item.qty || item.quantity || 1;

          for (const rec of recipes) {
            const qtyNeeded = rec.quantityRequired * itemQty;
            deductions.push({ ingredientId: rec.ingredientId, qtyNeeded });
          }

          // Deduction for extras selected in options (e.g. extra patty = ingredientId 1, extra cheese = ingredientId 3)
          if (item.options) {
            if (item.options.extraPatty) deductions.push({ ingredientId: 1, qtyNeeded: 1 * itemQty });
            if (item.options.addCheese) deductions.push({ ingredientId: 3, qtyNeeded: 1 * itemQty });
          }
        }
      }

      // Group deductions by ingredientId and update IngredientModel stock
      const aggregated = {};
      deductions.forEach(d => {
        aggregated[d.ingredientId] = (aggregated[d.ingredientId] || 0) + d.qtyNeeded;
      });

      for (const [ingId, qtyNeeded] of Object.entries(aggregated)) {
        const ing = await IngredientModel.findByPk(ingId);
        if (ing) {
          ing.stockQuantity = Math.max(0, ing.stockQuantity - qtyNeeded);
          ing.status = ing.stockQuantity < 50 ? 'Stock Bajo' : 'En Stock';
          ing.lastRestock = 'Descontado por pedido ' + order.code;
          await ing.save();
        }
      }

      res.json({ message: 'Pedido aceptado y stock descontado exitosamente', order, deductions: aggregated });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async rejectOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderModel.findByPk(id);
      if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
      order.status = 'Rechazado';
      await order.save();
      res.json({ message: 'Pedido rechazado', order });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await OrderModel.findByPk(id);
      if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
      order.status = status;
      await order.save();
      res.json({ ...order.toJSON(), items: JSON.parse(order.itemsJson || '[]') });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new OrderController();
