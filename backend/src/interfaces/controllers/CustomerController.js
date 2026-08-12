const CustomerModel = require('../../infrastructure/models/CustomerModel');
const OrderModel = require('../../infrastructure/models/OrderModel');

class CustomerController {
  static async getCustomers(req, res) {
    try {
      const customers = await CustomerModel.findAll({ order: [['id', 'DESC']] });
      res.json(customers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createCustomer(req, res) {
    try {
      const customer = await CustomerModel.create(req.body);
      res.status(201).json(customer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getHistory(req, res) {
    try {
      const { id } = req.params;
      const customer = await CustomerModel.findByPk(id);
      if (!customer) return res.status(404).json({ error: 'Cliente no encontrado' });

      const customerOrders = await OrderModel.findAll({
        where: { customerName: customer.name }
      });

      res.json({ customer, orders: customerOrders });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async importCsv(req, res) {
    try {
      const { csvData } = req.body;
      if (!csvData) return res.status(400).json({ error: 'Datos CSV no provistos' });

      const lines = csvData.split('\n').filter(l => l.trim());
      const imported = [];

      for (let i = 1; i < lines.length; i++) {
        const [name, phone, email, address] = lines[i].split(',').map(s => s ? s.trim() : '');
        if (name && phone) {
          const cust = await CustomerModel.create({ name, phone, email, address });
          imported.push(cust);
        }
      }

      res.json({ message: `${imported.length} clientes importados desde CSV`, imported });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = CustomerController;
