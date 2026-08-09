const CategoryModel = require('../../infrastructure/models/CategoryModel');

class CategoryController {
  async getAll(req, res) {
    try {
      const categories = await CategoryModel.findAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const { name, icon, description } = req.body;
      const category = await CategoryModel.create({ name, icon, description });
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CategoryController();
