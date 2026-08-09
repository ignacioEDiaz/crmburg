class Ingredient {
  constructor({ id, name, sku, category, stockQuantity, unit, maxStock, status, lastRestock }) {
    this.id = id;
    this.name = name;
    this.sku = sku;
    this.category = category; // 'Proteínas', 'Panadería', 'Lácteos', 'Vegetales', 'Salsas'
    this.stockQuantity = stockQuantity;
    this.unit = unit || 'un';
    this.maxStock = maxStock || 500;
    this.status = status || (stockQuantity < 50 ? 'Stock Bajo' : 'En Stock');
    this.lastRestock = lastRestock || 'Hoy, 08:30 AM';
  }
}

module.exports = Ingredient;
