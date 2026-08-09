const SequelizeIngredientRepository = require('../../infrastructure/repositories/SequelizeIngredientRepository');
const ingredientRepo = new SequelizeIngredientRepository();

class InventoryController {
  async getAll(req, res) {
    try {
      const items = await ingredientRepo.findAll();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const created = await ingredientRepo.create(req.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { stockQuantity } = req.body;
      const updated = await ingredientRepo.updateStock(id, Number(stockQuantity));
      if (!updated) return res.status(404).json({ message: 'Ingredient not found' });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new InventoryController();
