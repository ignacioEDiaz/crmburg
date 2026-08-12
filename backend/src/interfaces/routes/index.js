const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const CategoryController = require('../controllers/CategoryController');
const OrderController = require('../controllers/OrderController');
const InventoryController = require('../controllers/InventoryController');
const OfferController = require('../controllers/OfferController');
const CouponController = require('../controllers/CouponController');
const CashSessionController = require('../controllers/CashSessionController');
const SupplierExpenseController = require('../controllers/SupplierExpenseController');
const CustomerController = require('../controllers/CustomerController');
const UserController = require('../controllers/UserController');
const RecipeController = require('../controllers/RecipeController');

// Products
router.get('/products', (req, res) => ProductController.getAll(req, res));
router.get('/products/:id', (req, res) => ProductController.getById(req, res));
router.post('/products', (req, res) => ProductController.create(req, res));
router.put('/products/:id', (req, res) => ProductController.update(req, res));
router.delete('/products/:id', (req, res) => ProductController.delete(req, res));

// Categories
router.get('/categories', (req, res) => CategoryController.getAll(req, res));
router.post('/categories', (req, res) => CategoryController.create(req, res));

// Offers
router.get('/offers', (req, res) => OfferController.getAll(req, res));
router.post('/offers', (req, res) => OfferController.create(req, res));
router.put('/offers/:id', (req, res) => OfferController.update(req, res));
router.delete('/offers/:id', (req, res) => OfferController.delete(req, res));

// Coupons
router.get('/coupons', (req, res) => CouponController.getAll(req, res));
router.post('/coupons', (req, res) => CouponController.create(req, res));
router.post('/coupons/validate', (req, res) => CouponController.validate(req, res));
router.put('/coupons/:id', (req, res) => CouponController.update(req, res));
router.delete('/coupons/:id', (req, res) => CouponController.delete(req, res));

// Orders
router.get('/orders', (req, res) => OrderController.getAll(req, res));
router.post('/orders', (req, res) => OrderController.create(req, res));
router.post('/orders/:id/accept', (req, res) => OrderController.acceptOrder(req, res));
router.post('/orders/:id/reject', (req, res) => OrderController.rejectOrder(req, res));
router.patch('/orders/:id/status', (req, res) => OrderController.updateStatus(req, res));

// Inventory
router.get('/inventory', (req, res) => InventoryController.getAll(req, res));
router.post('/inventory', (req, res) => InventoryController.create(req, res));
router.patch('/inventory/:id/stock', (req, res) => InventoryController.updateStock(req, res));
router.post('/inventory/adjust', (req, res) => RecipeController.adjustStock(req, res));

// Cash Session & Movements (Caja Express)
router.get('/cash-session/current', (req, res) => CashSessionController.getCurrentSession(req, res));
router.post('/cash-session/open', (req, res) => CashSessionController.openSession(req, res));
router.post('/cash-session/close', (req, res) => CashSessionController.closeSession(req, res));
router.post('/cash-session/movements', (req, res) => CashSessionController.addMovement(req, res));
router.get('/cash-session/history', (req, res) => CashSessionController.getHistory(req, res));

// Suppliers & Purchases & Operating Expenses
router.get('/suppliers', (req, res) => SupplierExpenseController.getSuppliers(req, res));
router.post('/suppliers', (req, res) => SupplierExpenseController.createSupplier(req, res));
router.get('/purchases', (req, res) => SupplierExpenseController.getPurchases(req, res));
router.post('/purchases', (req, res) => SupplierExpenseController.createPurchase(req, res));
router.get('/expenses', (req, res) => SupplierExpenseController.getExpenses(req, res));
router.post('/expenses', (req, res) => SupplierExpenseController.createExpense(req, res));

// Customers & CRM
router.get('/customers', (req, res) => CustomerController.getCustomers(req, res));
router.post('/customers', (req, res) => CustomerController.createCustomer(req, res));
router.get('/customers/:id/history', (req, res) => CustomerController.getHistory(req, res));
router.post('/customers/import-csv', (req, res) => CustomerController.importCsv(req, res));

// Users, PIN Authorization & Audit Logs
router.get('/users', (req, res) => UserController.getUsers(req, res));
router.post('/users', (req, res) => UserController.createUser(req, res));
router.post('/users/authorize-pin', (req, res) => UserController.authorizePin(req, res));
router.get('/audit-logs', (req, res) => UserController.getAuditLogs(req, res));

// Recipes & Costing
router.get('/recipes/product/:productId', (req, res) => RecipeController.getRecipe(req, res));
router.post('/recipes', (req, res) => RecipeController.saveRecipe(req, res));

module.exports = router;
