import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function ItemDetailModal() {
  const { selectedProduct, setSelectedProduct, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('Doble');
  const [addCheese, setAddCheese] = useState(false);
  const [extraPatty, setExtraPatty] = useState(false);

  if (!selectedProduct) return null;

  const basePrice = selectedProduct.price;
  const extraPrice = (addCheese ? 1.00 : 0) + (extraPatty ? 2.00 : 0);
  const unitPrice = basePrice + extraPrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, { size, addCheese, extraPatty });
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      
      {/* Glassmorphic Modal Container */}
      <div className="relative w-full max-w-lg bg-[#141416]/75 backdrop-blur-2xl rounded-3xl border border-white/15 p-6 sm:p-7 flex flex-col gap-6 shadow-[0_30px_70px_rgba(0,0,0,0.95)] text-white my-8 overflow-hidden">
        
        {/* CRASH Mascot Background Watermark Silhouette */}
        <div className="absolute -right-12 -bottom-12 w-96 h-96 pointer-events-none opacity-[0.09] select-none z-0 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="CRASH Background"
            className="w-full h-full object-contain filter contrast-200"
          />
        </div>

        {/* Ambient Golden Neon Glow inside Modal */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black transition-all active:scale-90"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Content Wrapper (Above Background Z-Index) */}
        <div className="relative z-10 flex flex-col gap-6">

          {/* Large Image Header */}
          <div className="w-full h-56 relative bg-transparent rounded-2xl flex items-center justify-center p-4 my-1">
            <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] animate-float"
            />
          </div>

          {/* Product Meta */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">{selectedProduct.name}</h2>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-price-display text-[#ffb700] font-black text-2xl sm:text-3xl">
                  ${unitPrice.toFixed(2)}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="line-through text-xs sm:text-sm text-neutral-400 font-bold">
                    ${Number(selectedProduct.originalPrice).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-neutral-300 line-clamp-3 leading-relaxed">{selectedProduct.description}</p>
          </div>

          {/* Customization Options */}
          <div className="space-y-4 border-t border-white/10 pt-5">
            <h4 className="text-xs font-black uppercase text-[#ffb700] tracking-wider">Personaliza tu pedido</h4>

            {/* Size Options */}
            <div>
              <label className="text-xs text-neutral-400 font-bold block mb-2">Tamaño / Porción</label>
              <div className="grid grid-cols-3 gap-2.5">
                {['Sencilla', 'Doble', 'Triple'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                      size === s
                        ? 'bg-[#ffb700] text-black border-transparent font-black scale-[1.02]'
                        : 'bg-[#242428]/60 backdrop-blur-md border-white/10 text-neutral-300 hover:text-white hover:bg-[#2e2e34]/80'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Extra Addons */}
            <div className="space-y-2.5">
              <label className="text-xs text-neutral-400 font-bold block">Extras Opcionales</label>
              
              <label className="flex items-center justify-between bg-[#242428]/60 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl cursor-pointer hover:bg-[#2e2e34]/80 transition-colors">
                <span className="text-xs font-bold text-white">Queso Cheddar Extra (+$1.00)</span>
                <input
                  type="checkbox"
                  checked={addCheese}
                  onChange={(e) => setAddCheese(e.target.checked)}
                  className="w-4 h-4 accent-[#ffb700] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between bg-[#242428]/60 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl cursor-pointer hover:bg-[#2e2e34]/80 transition-colors">
                <span className="text-xs font-bold text-white">Medallón de Carne Extra (+$2.00)</span>
                <input
                  type="checkbox"
                  checked={extraPatty}
                  onChange={(e) => setExtraPatty(e.target.checked)}
                  className="w-4 h-4 accent-[#ffb700] rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Quantity & Add to Cart Footer */}
          <div className="flex items-center justify-between border-t border-white/10 pt-5 mt-1">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3 bg-[#242428]/80 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-full shadow-inner">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black transition-colors font-bold"
              >
                -
              </button>
              <span className="font-extrabold text-sm text-white w-4 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black transition-colors font-bold"
              >
                +
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 ml-4 py-3.5 px-6 rounded-full bg-[#ffb700] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all"
            >
              Agregar ${totalPrice.toFixed(2)}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
