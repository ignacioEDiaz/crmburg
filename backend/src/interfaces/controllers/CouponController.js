const CouponModel = require('../../infrastructure/models/CouponModel');

class CouponController {
  // Get all coupons
  async getAll(req, res) {
    try {
      const coupons = await CouponModel.findAll();
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create new coupon
  async create(req, res) {
    try {
      const { code, discountType, discountValue, scope, productName, durationDays, maxUses } = req.body;

      let expiresAt = null;
      let expirationType = 'forever';

      if (durationDays && durationDays !== 'forever') {
        const days = parseInt(durationDays, 10);
        if (!isNaN(days)) {
          expirationType = `${days}_days`;
          expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + days);
        }
      }

      const cleanCode = (code || `BURGER${Math.floor(10 + Math.random() * 90)}`).trim().toUpperCase();

      const coupon = await CouponModel.create({
        code: cleanCode,
        discountType: discountType || 'percentage',
        discountValue: Number(discountValue || 10),
        scope: scope || 'all',
        productName: scope === 'product' ? productName : null,
        expirationType,
        expiresAt,
        maxUses: maxUses ? parseInt(maxUses, 10) : null,
        usageCount: 0,
        isActive: true,
      });

      res.status(201).json(coupon);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Strict Backend Validation for Client Cart
  async validate(req, res) {
    try {
      const { code, items, cartTotal } = req.body;
      if (!code) return res.status(400).json({ valid: false, message: 'Ingresa un código de cupón' });

      const cleanCode = code.trim().toUpperCase();
      const coupon = await CouponModel.findOne({ where: { code: cleanCode } });

      if (!coupon) {
        return res.status(404).json({ valid: false, message: 'Cupón no válido o inexistente' });
      }

      if (!coupon.isActive) {
        return res.status(400).json({ valid: false, message: 'Este cupón se encuentra inactivo' });
      }

      // Check Expiration Date
      if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
        return res.status(400).json({ valid: false, message: '⏰ El cupón ha expirado' });
      }

      // Check Max Usage Limit
      if (coupon.maxUses !== null && coupon.usageCount >= coupon.maxUses) {
        return res.status(400).json({ valid: false, message: '🚫 El cupón ha alcanzado su límite de usos' });
      }

      // Check Product Scope Applicability
      if (coupon.scope === 'product' && coupon.productName) {
        const hasMatchingProduct = items && Array.isArray(items) && items.some(item => 
          item.name.toLowerCase().trim() === coupon.productName.toLowerCase().trim()
        );

        if (!hasMatchingProduct) {
          return res.status(400).json({ 
            valid: false, 
            message: `⚠️ Este cupón solo es válido si llevas en tu carrito "${coupon.productName}"` 
          });
        }
      }

      // Calculate Discount Amount
      let discountAmount = 0;
      const subtotal = Number(cartTotal || 0);

      if (coupon.discountType === 'percentage') {
        discountAmount = (subtotal * (coupon.discountValue / 100));
      } else {
        discountAmount = coupon.discountValue;
      }

      // Cap discount at total
      if (discountAmount > subtotal) discountAmount = subtotal;

      res.json({
        valid: true,
        couponId: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Number(discountAmount.toFixed(2)),
        message: `🎉 ¡Cupón ${coupon.code} aplicado con éxito!`
      });
    } catch (error) {
      res.status(500).json({ valid: false, message: error.message });
    }
  }

  // Update Coupon
  async update(req, res) {
    try {
      const { id } = req.params;
      const coupon = await CouponModel.findByPk(id);
      if (!coupon) return res.status(404).json({ message: 'Cupón no encontrado' });

      const { isActive, maxUses, discountValue } = req.body;
      if (isActive !== undefined) coupon.isActive = Boolean(isActive);
      if (maxUses !== undefined) coupon.maxUses = maxUses ? parseInt(maxUses, 10) : null;
      if (discountValue !== undefined) coupon.discountValue = Number(discountValue);

      await coupon.save();
      res.json(coupon);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete Coupon
  async delete(req, res) {
    try {
      const { id } = req.params;
      const coupon = await CouponModel.findByPk(id);
      if (!coupon) return res.status(404).json({ message: 'Cupón no encontrado' });
      await coupon.destroy();
      res.json({ message: 'Cupón eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CouponController();
