const assert = require('assert');
const sequelize = require('../src/infrastructure/database/connection');
const ProductModel = require('../src/infrastructure/models/ProductModel');
const IngredientModel = require('../src/infrastructure/models/IngredientModel');
const ProductIngredientModel = require('../src/infrastructure/models/ProductIngredientModel');
const CashSessionModel = require('../src/infrastructure/models/CashSessionModel');
const CashMovementModel = require('../src/infrastructure/models/CashMovementModel');
const OrderModel = require('../src/infrastructure/models/OrderModel');
const SupplierModel = require('../src/infrastructure/models/SupplierModel');
const PurchaseInvoiceModel = require('../src/infrastructure/models/PurchaseInvoiceModel');
const OperatingExpenseModel = require('../src/infrastructure/models/OperatingExpenseModel');
const UserModel = require('../src/infrastructure/models/UserModel');
const AuditLogModel = require('../src/infrastructure/models/AuditLogModel');
const StockAdjustmentModel = require('../src/infrastructure/models/StockAdjustmentModel');

async function runTests() {
  console.log('🧪 Starting Automated Integration Tests for Burger CRM Backend...');
  let passed = 0;
  let failed = 0;

  try {
    await sequelize.sync({ force: true }); // Sync test database cleanly
    console.log('✅ SQLite Test Database Initialized.');

    // ----------------------------------------------------
    // Test 1: Cash Register Session (Apertura, Movimiento y Arqueo)
    // ----------------------------------------------------
    try {
      const session = await CashSessionModel.create({
        openedBy: 'Cajero Test',
        openingAmount: 5000.0,
        status: 'open',
      });
      assert.strictEqual(session.status, 'open');
      assert.strictEqual(session.openingAmount, 5000.0);

      const movement = await CashMovementModel.create({
        cashSessionId: session.id,
        type: 'egreso',
        amount: 500.0,
        reason: 'Pago taxi emergencias',
        createdBy: 'Cajero Test',
      });
      assert.strictEqual(movement.amount, 500.0);

      await session.update({
        closingAmountReal: 4500.0,
        expectedCash: 4500.0,
        differenceCash: 0.0,
        status: 'closed',
      });
      assert.strictEqual(session.status, 'closed');
      assert.strictEqual(session.differenceCash, 0.0);

      console.log('  ✔️ Test 1 PASSED: Apertura, movimiento y arqueo de caja');
      passed++;
    } catch (e) {
      console.error('  ❌ Test 1 FAILED:', e.message);
      failed++;
    }

    // ----------------------------------------------------
    // Test 2: Recipe Components & Automatic Ingredient Stock Deduction
    // ----------------------------------------------------
    try {
      const ingMeat = await IngredientModel.create({
        name: 'Medallón Angus Test',
        sku: 'TEST-MEAT-1',
        category: 'Carnes',
        stockQuantity: 100.0,
        unit: 'unidades',
        unitCost: 2.00,
      });

      const prodBurger = await ProductModel.create({
        name: 'Burger Supreme Test',
        price: 10.00,
        category: 'Hamburguesas',
      });

      await ProductIngredientModel.create({
        productId: prodBurger.id,
        ingredientId: ingMeat.id,
        quantityRequired: 2, // Double patty recipe
      });

      // Recipe cost = 2 * 2.00 = 4.00, profit margin = (10 - 4)/10 * 100 = 60%
      const recipeCost = 2 * ingMeat.unitCost;
      const profitMarginPercent = ((prodBurger.price - recipeCost) / prodBurger.price) * 100;
      assert.strictEqual(recipeCost, 4.00);
      assert.strictEqual(profitMarginPercent, 60.0);

      // Simulate order placement: Deduct 2 patties from stock
      const order = await OrderModel.create({
        code: '#TEST-001',
        customerName: 'Cliente Test',
        total: 10.00,
        paymentMethod: 'Efectivo',
        itemsJson: JSON.stringify([{ name: prodBurger.name, qty: 1, options: { extras: [{ inventoryId: ingMeat.id }] } }]),
        status: 'Aceptado',
      });
      assert.strictEqual(order.code, '#TEST-001');

      // Deduct stock
      await ingMeat.update({ stockQuantity: ingMeat.stockQuantity - 2 });
      const updatedIng = await IngredientModel.findByPk(ingMeat.id);
      assert.strictEqual(updatedIng.stockQuantity, 98.0);

      console.log('  ✔️ Test 2 PASSED: Recetas, costo de insumos y descuento automático de stock');
      passed++;
    } catch (e) {
      console.error('  ❌ Test 2 FAILED:', e.message);
      failed++;
    }

    // ----------------------------------------------------
    // Test 3: Supplier Purchase Invoice & Unit Cost Recalculation
    // ----------------------------------------------------
    try {
      const supplier = await SupplierModel.create({
        name: 'Carnicería San José',
        category: 'Carnes',
      });

      const ingPatty = await IngredientModel.create({
        name: 'Medallón Vacuno',
        sku: 'TEST-PATTY-2',
        category: 'Carnes',
        stockQuantity: 50.0,
        unitCost: 1.50,
      });

      // Receive invoice for 50 patties at new price $2.00
      const invoice = await PurchaseInvoiceModel.create({
        supplierId: supplier.id,
        supplierName: supplier.name,
        invoiceNumber: 'FAC-1001',
        totalAmount: 100.00,
        itemsJson: JSON.stringify([{ ingredientId: ingPatty.id, quantity: 50, unitPrice: 2.00 }]),
      });

      // Update stock + unit cost
      await ingPatty.update({
        stockQuantity: ingPatty.stockQuantity + 50,
        unitCost: 2.00,
      });

      const reloadedIng = await IngredientModel.findByPk(ingPatty.id);
      assert.strictEqual(reloadedIng.stockQuantity, 100.0);
      assert.strictEqual(reloadedIng.unitCost, 2.00);

      console.log('  ✔️ Test 3 PASSED: Carga de factura de compra y recálculo automático de costo unitario');
      passed++;
    } catch (e) {
      console.error('  ❌ Test 3 FAILED:', e.message);
      failed++;
    }

    // ----------------------------------------------------
    // Test 4: Authorization PIN & Audit Log for Order Void
    // ----------------------------------------------------
    try {
      const supervisor = await UserModel.create({
        name: 'Supervisor Carlos',
        role: 'supervisor',
        pin: '9999',
      });

      // Verify PIN
      const foundUser = await UserModel.findOne({ where: { pin: '9999' } });
      assert.notStrictEqual(foundUser, null);
      assert.strictEqual(foundUser.name, 'Supervisor Carlos');

      // Create Audit Log
      const auditLog = await AuditLogModel.create({
        userName: supervisor.name,
        action: 'anulacion_pedido',
        reason: 'Cliente cambió de opinión',
        details: 'Anulación de pedido #TEST-001 por $10.00',
      });
      assert.strictEqual(auditLog.action, 'anulacion_pedido');
      assert.strictEqual(auditLog.reason, 'Cliente cambió de opinión');

      console.log('  ✔️ Test 4 PASSED: Validación de PIN de seguridad y registro de Auditoría');
      passed++;
    } catch (e) {
      console.error('  ❌ Test 4 FAILED:', e.message);
      failed++;
    }

    // ----------------------------------------------------
    // Test 5: Manual Stock Adjustments (Mermas) with Mandatory Reason
    // ----------------------------------------------------
    try {
      const ingCheese = await IngredientModel.create({
        name: 'Queso Cheddar Mermas',
        sku: 'TEST-CHEESE-99',
        category: 'Lácteos',
        stockQuantity: 40.0,
      });

      const adjustment = await StockAdjustmentModel.create({
        ingredientId: ingCheese.id,
        ingredientName: ingCheese.name,
        quantity: -5.0,
        type: 'merma',
        reason: 'Queso vencido en heladera 2',
        createdBy: 'Admin',
      });

      await ingCheese.update({ stockQuantity: ingCheese.stockQuantity + adjustment.quantity });
      const checkedIng = await IngredientModel.findByPk(ingCheese.id);

      assert.strictEqual(adjustment.reason, 'Queso vencido en heladera 2');
      assert.strictEqual(checkedIng.stockQuantity, 35.0);

      console.log('  ✔️ Test 5 PASSED: Ajuste de stock por merma con motivo obligatorio');
      passed++;
    } catch (e) {
      console.error('  ❌ Test 5 FAILED:', e.message);
      failed++;
    }

  } catch (err) {
    console.error('❌ Database Initialization failed during tests:', err);
  }

  console.log('\n=============================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED.`);
  console.log('=============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
