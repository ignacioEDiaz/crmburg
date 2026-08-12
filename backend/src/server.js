const app = require('./app');
const sequelize = require('./infrastructure/database/connection');

// Import all models to register them with Sequelize
require('./infrastructure/models/ProductModel');
require('./infrastructure/models/CategoryModel');
require('./infrastructure/models/OrderModel');
require('./infrastructure/models/IngredientModel');
require('./infrastructure/models/ProductIngredientModel');
require('./infrastructure/models/OfferModel');
require('./infrastructure/models/CouponModel');
require('./infrastructure/models/CashSessionModel');
require('./infrastructure/models/CashMovementModel');
require('./infrastructure/models/SupplierModel');
require('./infrastructure/models/PurchaseInvoiceModel');
require('./infrastructure/models/OperatingExpenseModel');
require('./infrastructure/models/CustomerModel');
require('./infrastructure/models/UserModel');
require('./infrastructure/models/AuditLogModel');
require('./infrastructure/models/StockAdjustmentModel');

const seedDatabase = require('./infrastructure/seeders/initialData');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('🔄 Initializing SQLite database with Sequelize...');
    await sequelize.sync();
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

startServer();
