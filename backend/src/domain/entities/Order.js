class Order {
  constructor({ id, code, customerName, customerAvatar, itemsSummary, items, total, status, date, createdAt }) {
    this.id = id;
    this.code = code; // e.g. #ORD-8921
    this.customerName = customerName;
    this.customerAvatar = customerAvatar;
    this.itemsSummary = itemsSummary;
    this.items = items || [];
    this.total = total;
    this.status = status || 'Pending'; // 'Pending', 'In Process', 'Sent', 'Delivered'
    this.date = date || new Date().toISOString();
    this.createdAt = createdAt || new Date();
  }
}

module.exports = Order;
