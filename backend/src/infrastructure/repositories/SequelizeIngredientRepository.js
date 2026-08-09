const IngredientModel = require('../models/IngredientModel');
const Ingredient = require('../../domain/entities/Ingredient');

class SequelizeIngredientRepository {
  async findAll() {
    const items = await IngredientModel.findAll();
    return items.map(i => new Ingredient(i.toJSON()));
  }

  async create(data) {
    const created = await IngredientModel.create({
      name: data.name,
      sku: data.sku || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      category: data.category || 'Varios',
      stockQuantity: data.stockQuantity || 100,
      unit: data.unit || 'un',
      maxStock: data.maxStock || 500,
      status: (data.stockQuantity || 100) < 50 ? 'Stock Bajo' : 'En Stock',
      lastRestock: 'Justo ahora',
    });
    return new Ingredient(created.toJSON());
  }

  async updateStock(id, stockQuantity) {
    const item = await IngredientModel.findByPk(id);
    if (!item) return null;
    item.stockQuantity = stockQuantity;
    item.status = stockQuantity < 50 ? 'Stock Bajo' : 'En Stock';
    item.lastRestock = 'Hace un momento';
    await item.save();
    return new Ingredient(item.toJSON());
  }
}

module.exports = SequelizeIngredientRepository;
