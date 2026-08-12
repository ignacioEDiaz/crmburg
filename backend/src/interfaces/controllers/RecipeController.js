const ProductIngredientModel = require('../../infrastructure/models/ProductIngredientModel');
const IngredientModel = require('../../infrastructure/models/IngredientModel');
const ProductModel = require('../../infrastructure/models/ProductModel');
const StockAdjustmentModel = require('../../infrastructure/models/StockAdjustmentModel');

class RecipeController {
  // Get Recipe Components & Cost for a Product
  static async getRecipe(req, res) {
    try {
      const { productId } = req.params;
      const product = await ProductModel.findByPk(productId);
      if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

      const recipeItems = await ProductIngredientModel.findAll({ where: { productId } });

      let recipeTotalCost = 0;
      const details = [];

      for (const item of recipeItems) {
        const ing = await IngredientModel.findByPk(item.ingredientId);
        if (ing) {
          const itemCost = (ing.unitCost || 0.50) * item.quantityRequired;
          recipeTotalCost += itemCost;
          details.push({
            ingredientId: ing.id,
            ingredientName: ing.name,
            unit: ing.unit,
            unitCost: ing.unitCost,
            quantityRequired: item.quantityRequired,
            totalCost: Number(itemCost.toFixed(2)),
          });
        }
      }

      const sellingPrice = Number(product.price || 0);
      const profitMarginAmount = sellingPrice - recipeTotalCost;
      const profitMarginPercent = sellingPrice > 0 ? (profitMarginAmount / sellingPrice) * 100 : 0;

      res.json({
        productId: product.id,
        productName: product.name,
        sellingPrice,
        recipeTotalCost: Number(recipeTotalCost.toFixed(2)),
        profitMarginAmount: Number(profitMarginAmount.toFixed(2)),
        profitMarginPercent: Number(profitMarginPercent.toFixed(1)),
        recipeComponents: details,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Save/Update Recipe for a Product
  static async saveRecipe(req, res) {
    try {
      const { productId, ingredients } = req.body; // Array of { ingredientId, quantityRequired }

      // Clear existing recipe
      await ProductIngredientModel.destroy({ where: { productId } });

      const created = [];
      if (Array.isArray(ingredients)) {
        for (const item of ingredients) {
          const rec = await ProductIngredientModel.create({
            productId,
            ingredientId: item.ingredientId,
            quantityRequired: Number(item.quantityRequired) || 1,
          });
          created.push(rec);
        }
      }

      res.status(201).json({ message: 'Receta actualizada con éxito', created });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Manual Stock Adjustment (Mermas, roturas, vencimiento con motivo obligatorio)
  static async adjustStock(req, res) {
    try {
      const { ingredientId, quantity, type, reason, createdBy } = req.body;

      if (!reason) {
        return res.status(400).json({ error: 'El motivo del ajuste de stock es obligatorio' });
      }

      const ing = await IngredientModel.findByPk(ingredientId);
      if (!ing) return res.status(404).json({ error: 'Ingrediente no encontrado' });

      const delta = Number(quantity) || 0;
      const newStock = Math.max(0, Number(ing.stockQuantity || 0) + delta);

      await ing.update({ stockQuantity: newStock });

      const adjustment = await StockAdjustmentModel.create({
        ingredientId: ing.id,
        ingredientName: ing.name,
        quantity: delta,
        type: type || 'merma',
        reason,
        createdBy: createdBy || 'Admin',
        date: new Date().toLocaleString(),
      });

      res.status(201).json({ adjustment, updatedIngredient: ing });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = RecipeController;
