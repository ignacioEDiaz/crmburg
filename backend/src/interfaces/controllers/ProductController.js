const ProductModel = require('../../infrastructure/models/ProductModel');
const SequelizeProductRepository = require('../../infrastructure/repositories/SequelizeProductRepository');
const productRepo = new SequelizeProductRepository();

class ProductController {
  async getAll(req, res) {
    try {
      const products = await productRepo.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const product = await productRepo.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const product = await productRepo.create(req.body);
      
      // Save ProductRecipe if recipe is provided
      if (req.body.recipe) {
        const ProductIngredientModel = require('../../infrastructure/models/ProductIngredientModel');
        const { carne, pan, cheddar } = req.body.recipe;
        if (carne) await ProductIngredientModel.create({ productId: product.id, ingredientId: 1, quantityRequired: Number(carne) });
        if (pan) await ProductIngredientModel.create({ productId: product.id, ingredientId: 2, quantityRequired: Number(pan) });
        if (cheddar) await ProductIngredientModel.create({ productId: product.id, ingredientId: 3, quantityRequired: Number(cheddar) });
      }

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductModel.findByPk(id);
      if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

      const { name, category, price, description, isSpicy, tag, image, recipe } = req.body;
      
      if (name !== undefined) product.name = name;
      if (category !== undefined) product.category = category;
      if (price !== undefined) product.price = Number(price);
      if (description !== undefined) product.description = description;
      if (isSpicy !== undefined) product.isSpicy = Boolean(isSpicy);
      if (tag !== undefined) product.tag = tag;
      if (image !== undefined && image !== null && image !== '') product.image = image;

      await product.save();

      // Update recipe ingredients if provided
      if (recipe) {
        const ProductIngredientModel = require('../../infrastructure/models/ProductIngredientModel');
        await ProductIngredientModel.destroy({ where: { productId: id } });
        if (recipe.carne) await ProductIngredientModel.create({ productId: id, ingredientId: 1, quantityRequired: Number(recipe.carne) });
        if (recipe.pan) await ProductIngredientModel.create({ productId: id, ingredientId: 2, quantityRequired: Number(recipe.pan) });
        if (recipe.cheddar) await ProductIngredientModel.create({ productId: id, ingredientId: 3, quantityRequired: Number(recipe.cheddar) });
      }

      res.json(product.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductModel.findByPk(id);
      if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
      await product.destroy();
      res.json({ message: 'Producto eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();
