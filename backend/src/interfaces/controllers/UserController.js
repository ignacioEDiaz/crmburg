const UserModel = require('../../infrastructure/models/UserModel');
const AuditLogModel = require('../../infrastructure/models/AuditLogModel');

class UserController {
  static async getUsers(req, res) {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createUser(req, res) {
    try {
      const user = await UserModel.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async authorizePin(req, res) {
    try {
      const { pin, action, reason, userName } = req.body;

      // Check pin
      const validUser = await UserModel.findOne({
        where: { pin: String(pin).trim(), active: true }
      });

      if (!validUser) {
        return res.status(401).json({ authorized: false, message: 'PIN de autorización inválido' });
      }

      // Record Audit Log if action provided
      if (action && reason) {
        await AuditLogModel.create({
          userName: validUser.name || userName || 'Supervisor',
          action,
          reason,
          details: `Acción "${action}" autorizada por ${validUser.name} (${validUser.role})`,
          createdAt: new Date().toLocaleString(),
        });
      }

      res.json({ authorized: true, user: validUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getAuditLogs(req, res) {
    try {
      const logs = await AuditLogModel.findAll({ order: [['id', 'DESC']] });
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = UserController;
