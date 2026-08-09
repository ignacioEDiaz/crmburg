const OfferModel = require('../../infrastructure/models/OfferModel');

class OfferController {
  async getAll(req, res) {
    try {
      const offers = await OfferModel.findAll();
      res.json(offers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const offer = await OfferModel.create(req.body);
      res.status(201).json(offer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const offer = await OfferModel.findByPk(id);
      if (!offer) return res.status(404).json({ message: 'Oferta no encontrada' });

      const { title, productName, originalPrice, offerPrice, stockQuantity, discountBadge, image, description } = req.body;
      if (title !== undefined) offer.title = title;
      if (productName !== undefined) offer.productName = productName;
      if (originalPrice !== undefined) offer.originalPrice = Number(originalPrice);
      if (offerPrice !== undefined) offer.offerPrice = Number(offerPrice);
      if (stockQuantity !== undefined) offer.stockQuantity = Number(stockQuantity);
      if (discountBadge !== undefined) offer.discountBadge = discountBadge;
      if (image !== undefined && image !== '') offer.image = image;
      if (description !== undefined) offer.description = description;

      await offer.save();
      res.json(offer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const offer = await OfferModel.findByPk(id);
      if (!offer) return res.status(404).json({ message: 'Oferta no encontrada' });
      await offer.destroy();
      res.json({ message: 'Oferta eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new OfferController();
