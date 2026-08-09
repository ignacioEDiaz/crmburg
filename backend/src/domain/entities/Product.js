class Product {
  constructor({ id, name, category, price, rating, reviewsCount, description, isSpicy, image, tag }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.rating = rating || 4.8;
    this.reviewsCount = reviewsCount || 120;
    this.description = description;
    this.isSpicy = Boolean(isSpicy);
    this.image = image;
    this.tag = tag;
  }
}

module.exports = Product;
