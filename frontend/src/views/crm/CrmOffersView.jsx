import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Tag, Pencil, Trash2, Image as ImageIcon, Flame, ShoppingBag } from 'lucide-react';

export default function CrmOffersView() {
  const { offers, products, handleCreateOffer, handleUpdateOffer, handleDeleteOffer } = useApp();

  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  // Offer Form States
  const [title, setTitle] = useState('');
  const [productName, setProductName] = useState(products[0]?.name || 'Hamburguesa de Pollo Picante');
  const [originalPrice, setOriginalPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState(30);
  const [discountBadge, setDiscountBadge] = useState('20% OFF');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const handleOpenCreateOffer = () => {
    setEditingOffer(null);
    setTitle('');
    setProductName(products[0]?.name || 'Hamburguesa de Pollo Picante');
    setOriginalPrice('');
    setOfferPrice('');
    setStockQuantity(30);
    setDiscountBadge('20% OFF');
    setImage('');
    setDescription('');
    setShowOfferModal(true);
  };

  const handleOpenEditOffer = (off) => {
    setEditingOffer(off);
    setTitle(off.title || '');
    setProductName(off.productName || (products[0]?.name || ''));
    setOriginalPrice(off.originalPrice || '');
    setOfferPrice(off.offerPrice || '');
    setStockQuantity(off.stockQuantity || 30);
    setDiscountBadge(off.discountBadge || '20% OFF');
    setImage(off.image || '');
    setDescription(off.description || '');
    setShowOfferModal(true);
  };

  // Canvas PNG transparent image upload handler
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const transparentBase64 = canvas.toDataURL('image/png');
        setImage(transparentBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const onSubmitOffer = (e) => {
    e.preventDefault();
    if (!title || !offerPrice) return;

    const payload = {
      title,
      productName: productName || 'Producto',
      originalPrice: Number(originalPrice || offerPrice * 1.25),
      offerPrice: Number(offerPrice),
      stockQuantity: Number(stockQuantity),
      discountBadge: discountBadge || 'OFERTA',
      image: image || 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png',
      description,
    };

    if (editingOffer) {
      handleUpdateOffer(editingOffer.id, payload);
    } else {
      handleCreateOffer(payload);
    }

    setShowOfferModal(false);
    setEditingOffer(null);
  };

  return (
    <div className="flex flex-col w-full gap-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-headline-xl font-headline-xl text-on-surface">Gestión de Ofertas Personalizadas</h1>
            <span className="bg-primary/20 text-primary font-bold text-xs px-3 py-1 rounded-full border border-primary/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-primary" />
              Promociones
            </span>
          </div>
          <p className="text-body-lg text-on-surface-variant mt-xs">
            Crea y administra ofertas personalizadas indicando productos, precios rebajados, imágenes y cantidades de stock de la promoción.
          </p>
        </div>

        <button
          onClick={handleOpenCreateOffer}
          className="bg-primary hover:bg-primary-container text-on-primary font-bold px-lg py-sm rounded-full shadow-md transition-all flex items-center gap-xs"
        >
          <Plus className="w-4 h-4" />
          Nueva Oferta Personalizada
        </button>
      </div>

      {/* Offers Cards Grid */}
      {offers.length === 0 ? (
        <div className="bg-surface-container-low/60 border border-white/10 rounded-3xl p-12 text-center text-on-surface-variant flex flex-col items-center justify-center gap-3">
          <Tag className="w-12 h-12 text-on-surface-variant/40" />
          <h3 className="text-xl font-bold text-on-surface">No hay ofertas personalizadas activas</h3>
          <p className="text-sm">Haz clic en "Nueva Oferta Personalizada" para crear promociones especiales que verán tus clientes en la App.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {offers.map((off) => (
            <div key={off.id} className="bg-surface-container-low/80 border border-white/10 rounded-3xl p-lg flex flex-col justify-between shadow-xl relative group">
              
              {/* Badge & Stock */}
              <div className="flex justify-between items-start mb-md">
                <span className="bg-primary text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                  {off.discountBadge}
                </span>

                <span className="bg-surface-container-high text-on-surface-variant font-bold text-xs px-3 py-1 rounded-full border border-white/10">
                  Stock: <strong className="text-white">{off.stockQuantity} un.</strong>
                </span>
              </div>

              {/* Offer Details */}
              <div className="flex gap-md items-center my-2">
                <div className="w-24 h-24 rounded-2xl bg-transparent border border-white/5 flex items-center justify-center p-1 shrink-0">
                  <img src={off.image} alt={off.title} className="w-full h-full object-contain drop-shadow-md" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-on-surface text-body-lg line-clamp-1">{off.title}</h3>
                  <p className="text-xs text-primary font-bold mt-0.5">Producto: {off.productName}</p>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">{off.description}</p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <span className="font-price-display text-headline-lg font-black text-primary">$ {Number(off.offerPrice).toFixed(2)}</span>
                    {off.originalPrice && (
                      <span className="line-through text-xs text-on-surface-variant font-bold">$ {Number(off.originalPrice).toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex justify-end gap-2 border-t border-white/10 pt-3 mt-4">
                <button
                  onClick={() => handleOpenEditOffer(off)}
                  className="px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Editar Oferta
                </button>

                <button
                  onClick={() => handleDeleteOffer(off.id)}
                  className="px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal: Crear / Editar Oferta Personalizada */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface-container-low border border-white/10 rounded-3xl p-lg w-full max-w-lg flex flex-col gap-md shadow-2xl my-8">
            <h3 className="text-headline-lg font-bold text-on-surface">
              {editingOffer ? `Editar Oferta: ${editingOffer.title}` : 'Crear Nueva Oferta Personalizada'}
            </h3>

            <form onSubmit={onSubmitOffer} className="flex flex-col gap-md">
              <div>
                <label className="text-xs text-on-surface-variant block mb-1 font-bold">Título de la Oferta / Promoción</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Combo Mega Burger 20% OFF"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="text-xs text-on-surface-variant block mb-1 font-bold">Producto Asociado</label>
                  <select
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                  >
                    {products.map(p => (
                      <option key={p.id || p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-on-surface-variant block mb-1 font-bold">Etiqueta (Badge)</label>
                  <input
                    type="text"
                    placeholder="20% OFF, LLEVA 2 PAYA 1..."
                    value={discountBadge}
                    onChange={(e) => setDiscountBadge(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-md">
                <div>
                  <label className="text-xs text-on-surface-variant block mb-1 font-bold">Precio Oferta ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="4.99"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary font-bold text-primary"
                  />
                </div>

                <div>
                  <label className="text-xs text-on-surface-variant block mb-1 font-bold">Precio Normal ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="6.49"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs text-on-surface-variant block mb-1 font-bold">Stock Promocional</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-on-surface-variant block mb-1 font-bold">Descripción de la Oferta</label>
                <textarea
                  rows="2"
                  placeholder="Detalles de la oferta especial..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                />
              </div>

              {/* Subir Imagen de la Oferta */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant block font-bold">Imagen de la Oferta</label>
                
                <div className="flex gap-md items-center">
                  <label className="flex items-center gap-2 px-md py-sm bg-surface-container-highest rounded-xl border border-white/10 cursor-pointer hover:bg-surface-bright text-xs text-on-surface font-bold">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    Subir archivo desde PC (PNG Transparente)
                    <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                  </label>
                  <span className="text-xs text-on-surface-variant">o pegar URL:</span>
                </div>

                <input
                  type="text"
                  placeholder="https://ejemplo.com/oferta.png"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl p-sm text-xs text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                />

                {image && (
                  <div className="w-24 h-24 rounded-xl border border-white/10 overflow-hidden bg-transparent p-1 mt-1">
                    <img src={image} alt="Vista previa" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-sm mt-md">
                <button
                  type="button"
                  onClick={() => {
                    setShowOfferModal(false);
                    setEditingOffer(null);
                  }}
                  className="px-md py-sm rounded-full bg-surface-container-highest text-on-surface-variant hover:text-on-surface font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-md py-sm rounded-full bg-primary text-on-primary font-bold text-xs shadow-md"
                >
                  {editingOffer ? 'Guardar Cambios' : 'Guardar Oferta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
