const ProductModel = require('../models/ProductModel');
const CategoryModel = require('../models/CategoryModel');
const OrderModel = require('../models/OrderModel');
const IngredientModel = require('../models/IngredientModel');
const ProductIngredientModel = require('../models/ProductIngredientModel');
const OfferModel = require('../models/OfferModel');
const CouponModel = require('../models/CouponModel');

async function seedData() {
  const catCount = await CategoryModel.count();
  if (catCount === 0) {
    await CategoryModel.bulkCreate([
      { name: 'Hamburguesas', icon: 'lunch_dining', description: 'Jugosas hamburguesas artesanales de carne de res y pollo' },
      { name: 'Pizzas', icon: 'local_pizza', description: 'Pizzas a la piedra con queso cheddar y mozarella' },
      { name: 'Pollo', icon: 'set_meal', description: 'Nuggets y alitas de pollo crujientes' },
      { name: 'Papas Fritas', icon: 'fastfood', description: 'Papas fritas crocantes y sazonadas' },
      { name: 'Bebidas', icon: 'local_bar', description: 'Gaseosas frías, jugos y malteadas' },
    ]);
  }

  const prodCount = await ProductModel.count();
  if (prodCount === 0) {
    const p1 = await ProductModel.create({
      name: 'Hamburguesa de Queso Clásica',
      category: 'Hamburguesas',
      price: 5.49,
      rating: 4.8,
      reviewsCount: 120,
      description: 'Hamburguesa clásica con queso cheddar derretido, lechuga fresca y tomate en pan con sésamo.',
      isSpicy: false,
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png',
    });

    const p2 = await ProductModel.create({
      name: 'Hamburguesa de Pollo Picante',
      category: 'Hamburguesas',
      price: 6.49,
      rating: 4.9,
      reviewsCount: 98,
      description: 'Medallón de pollo crujiente picante con lechuga fresca, tomate, cebolla y salsa especial de la casa.',
      isSpicy: true,
      tag: 'Picante',
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png',
    });

    await ProductModel.create({
      name: 'Doble Carne y Bacon Extra',
      category: 'Hamburguesas',
      price: 8.99,
      rating: 4.9,
      reviewsCount: 154,
      description: 'Doble medallón de res, doble queso cheddar derretido y panceta ahumada crujiente.',
      isSpicy: false,
      tag: 'Popular',
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png',
    });

    await ProductModel.create({
      name: 'Pizza Especial de Pepperoni',
      category: 'Pizzas',
      price: 11.99,
      rating: 4.7,
      reviewsCount: 84,
      description: 'Pizza a la piedra con queso mozarella derretido y abundante pepperoni crujiente.',
      isSpicy: false,
      tag: 'Familiar',
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png',
    });

    // Product Recipe mappings
    await ProductIngredientModel.bulkCreate([
      { productId: p1.id, ingredientId: 1, quantityRequired: 1 },
      { productId: p1.id, ingredientId: 2, quantityRequired: 1 },
      { productId: p1.id, ingredientId: 3, quantityRequired: 2 },
      { productId: p2.id, ingredientId: 1, quantityRequired: 1 },
      { productId: p2.id, ingredientId: 2, quantityRequired: 1 },
    ]);
  }

  const ingCount = await IngredientModel.count();
  if (ingCount === 0) {
    await IngredientModel.bulkCreate([
      { name: 'Medallones de Carne', sku: 'PRT-001', category: 'Proteínas', stockQuantity: 450, unit: 'un', maxStock: 600, status: 'En Stock', lastRestock: 'Hoy, 08:30 AM' },
      { name: 'Panes Brioche', sku: 'PAN-012', category: 'Panadería', stockQuantity: 300, unit: 'un', maxStock: 400, status: 'En Stock', lastRestock: 'Ayer, 18:00 PM' },
      { name: 'Queso Cheddar Fetear', sku: 'LAC-005', category: 'Lácteos', stockQuantity: 280, unit: 'fetas', maxStock: 500, status: 'En Stock', lastRestock: 'Hoy, 08:30 AM' },
      { name: 'Panceta Ahumada', sku: 'PRT-009', category: 'Proteínas', stockQuantity: 150, unit: 'fetas', maxStock: 300, status: 'En Stock', lastRestock: 'Hace 2 días' },
    ]);
  }

  const offerCount = await OfferModel.count();
  if (offerCount === 0) {
    await OfferModel.bulkCreate([
      {
        title: 'Combo Burger Picante Especial',
        productName: 'Hamburguesa de Pollo Picante',
        originalPrice: 6.49,
        offerPrice: 4.99,
        stockQuantity: 30,
        discountBadge: '20% OFF',
        description: 'Combo promocional con papas y gaseosa incluida a precio rebajado por tiempo limitado.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png',
      },
      {
        title: 'Promo Parejas 2x1 Doble Carne',
        productName: 'Doble Carne y Bacon Extra',
        originalPrice: 17.98,
        offerPrice: 11.99,
        stockQuantity: 15,
        discountBadge: 'LLEVA 2 PAYA 1',
        description: 'Lleva dos hamburguesas dobles con panceta por el precio de una y media.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png',
      }
    ]);
  }

  const couponCount = await CouponModel.count();
  if (couponCount === 0) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);

    await CouponModel.bulkCreate([
      {
        code: 'BURGER20',
        discountType: 'percentage',
        discountValue: 20,
        scope: 'all',
        expirationType: '7_days',
        expiresAt: tomorrow,
        maxUses: 100,
        usageCount: 14,
        isActive: true,
      },
      {
        code: 'POLLO5',
        discountType: 'fixed',
        discountValue: 2.0,
        scope: 'product',
        productName: 'Hamburguesa de Pollo Picante',
        expirationType: 'forever',
        expiresAt: null,
        maxUses: 50,
        usageCount: 8,
        isActive: true,
      }
    ]);
  }

  const orderCount = await OrderModel.count();
  if (orderCount === 0) {
    await OrderModel.bulkCreate([
      {
        code: '#PED-8921',
        customerName: 'Santiago Rodríguez',
        itemsSummary: '2x Hamburguesa de Queso Clásica',
        itemsJson: JSON.stringify([{ name: 'Hamburguesa de Queso Clásica', qty: 2, price: 5.49 }]),
        total: 10.98,
        status: 'Pendiente',
        date: 'Hoy, 19:32',
      },
      {
        code: '#PED-8920',
        customerName: 'Valeria Gómez',
        itemsSummary: '1x Hamburguesa de Pollo Picante',
        itemsJson: JSON.stringify([{ name: 'Hamburguesa de Pollo Picante', qty: 1, price: 6.49 }]),
        total: 6.49,
        status: 'Aceptado',
        date: 'Hoy, 19:15',
      }
    ]);
  }

  console.log('✅ Base de datos iniciada correctamente con cupones.');
}

module.exports = seedData;
