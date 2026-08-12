const SupplierModel = require('../../infrastructure/models/SupplierModel');
const PurchaseInvoiceModel = require('../../infrastructure/models/PurchaseInvoiceModel');
const OperatingExpenseModel = require('../../infrastructure/models/OperatingExpenseModel');
const IngredientModel = require('../../infrastructure/models/IngredientModel');

class SupplierExpenseController {
  // Suppliers
  static async getSuppliers(req, res) {
    try {
      const suppliers = await SupplierModel.findAll({ order: [['id', 'DESC']] });
      res.json(suppliers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createSupplier(req, res) {
    try {
      const supplier = await SupplierModel.create(req.body);
      res.status(201).json(supplier);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Purchases from Suppliers (Updates Ingredient Stock & Recalculates Unit Cost)
  static async getPurchases(req, res) {
    try {
      const purchases = await PurchaseInvoiceModel.findAll({ order: [['id', 'DESC']] });
      res.json(purchases);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createPurchase(req, res) {
    try {
      const { supplierId, supplierName, invoiceNumber, totalAmount, items, status } = req.body;

      const purchase = await PurchaseInvoiceModel.create({
        supplierId: supplierId || 1,
        supplierName: supplierName || 'Proveedor',
        invoiceNumber: invoiceNumber || `FACT-${Date.now()}`,
        totalAmount: Number(totalAmount) || 0,
        status: status || 'pagada',
        itemsJson: typeof items === 'string' ? items : JSON.stringify(items || []),
        date: new Date().toLocaleString(),
      });

      // Process items: Increase ingredient stock AND recalculate unit cost!
      const itemsList = Array.isArray(items) ? items : (typeof items === 'string' ? JSON.parse(items) : []);
      for (const item of itemsList) {
        if (item.ingredientId) {
          const ing = await IngredientModel.findByPk(item.ingredientId);
          if (ing) {
            const addedQty = Number(item.quantity) || 0;
            const newUnitCost = Number(item.unitPrice || item.cost) || ing.unitCost;
            const newStock = Number(ing.stockQuantity || 0) + addedQty;

            await ing.update({
              stockQuantity: newStock,
              unitCost: newUnitCost,
              lastRestock: `Hoy, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            });
          }
        }
      }

      res.status(201).json(purchase);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Operating Expenses
  static async getExpenses(req, res) {
    try {
      const expenses = await OperatingExpenseModel.findAll({ order: [['id', 'DESC']] });
      res.json(expenses);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createExpense(req, res) {
    try {
      const expense = await OperatingExpenseModel.create(req.body);
      res.status(201).json(expense);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = SupplierExpenseController;
