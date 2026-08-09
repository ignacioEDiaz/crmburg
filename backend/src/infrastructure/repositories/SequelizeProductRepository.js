const ProductModel = require('../models/ProductModel');
const Product = require('../../domain/entities/Product');

class SequelizeProductRepository {
  async findAll() {
    const products = await ProductModel.findAll();
    return products.map(p => new Product(p.toJSON()));
  }

  async findById(id) {
    const product = await ProductModel.findByPk(id);
    if (!product) return null;
    return new Product(product.toJSON());
  }

  async create(productData) {
    const created = await ProductModel.create(productData);
    return new Product(created.toJSON());
  }
}

module.exports = SequelizeProductRepository;
