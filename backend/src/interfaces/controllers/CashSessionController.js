const CashSessionModel = require('../../infrastructure/models/CashSessionModel');
const CashMovementModel = require('../../infrastructure/models/CashMovementModel');
const OrderModel = require('../../infrastructure/models/OrderModel');

class CashSessionController {
  static async getCurrentSession(req, res) {
    try {
      let activeSession = await CashSessionModel.findOne({
        where: { status: 'open' },
        order: [['id', 'DESC']],
      });

      if (!activeSession) {
        // Auto-create initial open session if none exists
        activeSession = await CashSessionModel.create({
          openedBy: 'Cajero Principal',
          openingAmount: 5000.0,
          status: 'open',
          openedAt: new Date().toLocaleString(),
        });
      }

      // Calculate totals for current active cash session
      const orders = await OrderModel.findAll();

      let expectedCash = activeSession.openingAmount;
      let expectedCard = 0;
      let expectedMP = 0;
      let expectedTransfer = 0;

      orders.forEach(o => {
        if (o.status !== 'Rechazado' && o.status !== 'Anulado') {
          const total = Number(o.total || 0);
          const pm = (o.paymentMethod || 'Efectivo').toLowerCase();

          if (pm.includes('mercadopago') || pm.includes('mp') || pm.includes('qr')) {
            expectedMP += total;
          } else if (pm.includes('tarjeta') || pm.includes('debito') || pm.includes('credito')) {
            expectedCard += total;
          } else if (pm.includes('transferencia') || pm.includes('transf')) {
            expectedTransfer += total;
          } else {
            expectedCash += total;
          }
        }
      });

      // Factor in movements
      const movements = await CashMovementModel.findAll({
        where: { cashSessionId: activeSession.id }
      });

      movements.forEach(m => {
        if (m.type === 'ingreso') expectedCash += m.amount;
        if (m.type === 'egreso' || m.type === 'retiro_parcial') expectedCash -= m.amount;
      });

      res.json({
        activeSession,
        expectedTotals: {
          expectedCash: Number(expectedCash.toFixed(2)),
          expectedCard: Number(expectedCard.toFixed(2)),
          expectedMP: Number(expectedMP.toFixed(2)),
          expectedTransfer: Number(expectedTransfer.toFixed(2)),
          movements
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async openSession(req, res) {
    try {
      const { openedBy, openingAmount, notes } = req.body;

      // Close any previously open session
      await CashSessionModel.update(
        { status: 'closed', closedAt: new Date().toLocaleString() },
        { where: { status: 'open' } }
      );

      const newSession = await CashSessionModel.create({
        openedBy: openedBy || 'Cajero Principal',
        openingAmount: Number(openingAmount) || 5000.0,
        status: 'open',
        notes: notes || 'Apertura de turno',
        openedAt: new Date().toLocaleString(),
      });

      res.status(201).json(newSession);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async closeSession(req, res) {
    try {
      const { closingAmountReal, closedBy, notes } = req.body;

      const activeSession = await CashSessionModel.findOne({
        where: { status: 'open' },
        order: [['id', 'DESC']],
      });

      if (!activeSession) {
        return res.status(400).json({ error: 'No hay ninguna caja abierta para cerrar' });
      }

      // Calculate totals
      const orders = await OrderModel.findAll();
      let expectedCash = activeSession.openingAmount;
      orders.forEach(o => {
        if (o.status !== 'Rechazado' && o.status !== 'Anulado') {
          const pm = (o.paymentMethod || 'Efectivo').toLowerCase();
          if (!pm.includes('mercadopago') && !pm.includes('mp') && !pm.includes('tarjeta') && !pm.includes('transferencia')) {
            expectedCash += Number(o.total || 0);
          }
        }
      });

      const movements = await CashMovementModel.findAll({ where: { cashSessionId: activeSession.id } });
      movements.forEach(m => {
        if (m.type === 'ingreso') expectedCash += m.amount;
        if (m.type === 'egreso' || m.type === 'retiro_parcial') expectedCash -= m.amount;
      });

      const realCash = Number(closingAmountReal) || 0;
      const differenceCash = Number((realCash - expectedCash).toFixed(2));

      await activeSession.update({
        closingAmountReal: realCash,
        expectedCash: Number(expectedCash.toFixed(2)),
        differenceCash,
        closedBy: closedBy || 'Cajero',
        notes: notes || 'Arqueo de caja realizado',
        status: 'closed',
        closedAt: new Date().toLocaleString(),
      });

      res.json(activeSession);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async addMovement(req, res) {
    try {
      const { type, amount, reason, authorizedBy, createdBy } = req.body;

      const activeSession = await CashSessionModel.findOne({
        where: { status: 'open' },
        order: [['id', 'DESC']],
      });

      const movement = await CashMovementModel.create({
        cashSessionId: activeSession ? activeSession.id : null,
        type: type || 'egreso',
        amount: Number(amount) || 0,
        reason: reason || 'Movimiento de caja',
        authorizedBy: authorizedBy || 'Supervisor',
        createdBy: createdBy || 'Cajero',
        createdAt: new Date().toLocaleString(),
      });

      res.status(201).json(movement);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getHistory(req, res) {
    try {
      const sessions = await CashSessionModel.findAll({
        order: [['id', 'DESC']],
      });
      res.json(sessions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = CashSessionController;
