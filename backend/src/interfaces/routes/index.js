const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const CategoryController = require('../controllers/CategoryController');
const OrderController = require('../controllers/OrderController');
const InventoryController = require('../controllers/InventoryController');
const OfferController = require('../controllers/OfferController');
const CouponController = require('../controllers/CouponController');

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

module.exports = router;
