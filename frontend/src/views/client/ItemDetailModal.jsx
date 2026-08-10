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
      <div className="relative w-full max-w-lg bg-[#18181b] rounded-3xl border border-white/10 p-6 flex flex-col gap-6 shadow-2xl text-white my-8">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#242426] border border-white/10 flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Large Image Header */}
        <div className="w-full h-56 relative bg-transparent rounded-2xl flex items-center justify-center p-4 my-2">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="h-full object-contain drop-shadow-2xl"
          />
        </div>

        {/* Product Meta */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">{selectedProduct.name}</h2>
            <span className="font-price-display text-[#ffb700] font-black text-2xl">
              ${unitPrice.toFixed(2)}
            </span>
          </div>

          <p className="text-sm text-secondary line-clamp-3">{selectedProduct.description}</p>
        </div>

        {/* Customization Options */}
        <div className="space-y-4 border-t border-white/10 pt-4">
          <h4 className="text-xs font-black uppercase text-[#ffb700] tracking-wider">Personaliza tu pedido</h4>

          {/* Size Options */}
          <div>
            <label className="text-xs text-secondary font-bold block mb-2">Tamaño / Porción</label>
            <div className="grid grid-cols-3 gap-2">
              {['Sencilla', 'Doble', 'Triple'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    size === s
                      ? 'bg-[#ffb700] text-black border-[#ffb700] font-black shadow-md'
                      : 'bg-[#242426] border-white/10 text-secondary hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Extra Addons */}
          <div className="space-y-2">
            <label className="text-xs text-secondary font-bold block">Extras Opcionales</label>
            
            <label className="flex items-center justify-between bg-[#242426] border border-white/10 p-3 rounded-xl cursor-pointer hover:bg-[#2c2c2e]">
              <span className="text-xs font-bold text-white">Queso Cheddar Extra (+$1.00)</span>
              <input
                type="checkbox"
                checked={addCheese}
                onChange={(e) => setAddCheese(e.target.checked)}
                className="w-4 h-4 accent-[#ffb700] rounded"
              />
            </label>

            <label className="flex items-center justify-between bg-[#242426] border border-white/10 p-3 rounded-xl cursor-pointer hover:bg-[#2c2c2e]">
              <span className="text-xs font-bold text-white">Medallón de Carne Extra (+$2.00)</span>
              <input
                type="checkbox"
                checked={extraPatty}
                onChange={(e) => setExtraPatty(e.target.checked)}
                className="w-4 h-4 accent-[#ffb700] rounded"
              />
            </label>
          </div>
        </div>

        {/* Quantity & Add to Cart Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-[#242426] border border-white/10 px-3 py-1.5 rounded-full">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black transition-colors"
            >
              -
            </button>
            <span className="font-bold text-sm text-white w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black transition-colors"
            >
              +
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 ml-4 py-3.5 px-6 rounded-full bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
          >
            Agregar ${totalPrice.toFixed(2)}
          </button>
        </div>

      </div>
    </div>
  );
}
