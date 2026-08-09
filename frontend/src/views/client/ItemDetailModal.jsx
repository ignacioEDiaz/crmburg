import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function ItemDetailModal() {
  const { selectedProduct, setSelectedProduct, addToCart } = useApp();
  const [size, setSize] = useState('Regular');
  const [addCheese, setAddCheese] = useState(true);
  const [extraPatty, setExtraPatty] = useState(false);
  const [addBacon, setAddBacon] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(true);

  if (!selectedProduct) return null;

  let extraPrice = 0;
  if (size === 'Grande') extraPrice += 1.5;
  if (size === 'X Grande') extraPrice += 2.5;
  if (addCheese) extraPrice += 0.5;
  if (extraPatty) extraPrice += 2.0;
  if (addBacon) extraPrice += 1.0;

  const totalPrice = ((selectedProduct.price + extraPrice) * quantity).toFixed(2);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, { size, addCheese, extraPatty, addBacon });
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0 md:p-4">
      <div className="relative w-full max-w-md h-full md:h-[90vh] bg-background font-body-lg text-on-background overflow-y-auto hide-scrollbar rounded-none md:rounded-[32px] border border-white/10 shadow-2xl">
        
        {/* Header */}
        <header className="fixed top-0 inset-x-0 max-w-md mx-auto z-50 bg-surface-container-low/90 backdrop-blur-md pt-safe">
          <div className="h-16 px-4 flex items-center justify-between">
            <button
              onClick={() => setSelectedProduct(null)}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-on-surface"
            >
              <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
            <h1 className="font-title-md text-title-md text-on-surface truncate">Detalle del Producto</h1>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-on-surface hover:bg-white/10 transition-colors shadow-sm"
            >
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontVariationSettings: isFavorite ? '"FILL" 1' : '"FILL" 0' }}
              >
                favorite
              </span>
            </button>
          </div>
        </header>

        <main className="relative w-full pt-16 bg-transparent pb-36">
          <div className="flex flex-col w-full relative min-h-[calc(100vh-4rem)]">
            
            {/* Hero Image */}
            <div className="relative w-full aspect-square z-10 -mt-16 pt-16 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full z-0"
                style={{ backgroundImage: `url('${selectedProduct.image}')` }}
              ></div>
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-surface/80 to-transparent z-10 pointer-events-none"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-20 flex-1 px-container-padding pb-10 -mt-10">
              <div className="bg-surface-container-low rounded-[32px] p-lg flex flex-col gap-lg shadow-xl border border-white/10 relative overflow-hidden">

                {/* Title & Badge */}
                <div className="flex flex-col gap-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      {selectedProduct.isSpicy && (
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-error/20 border border-error/30 self-start mb-2">
                          <span className="text-error font-label-bold text-xs">Picante</span>
                        </div>
                      )}
                      <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                        {selectedProduct.name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>
                        star
                      </span>
                      <span className="font-title-md text-title-md text-on-surface">{selectedProduct.rating || 4.8}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">({selectedProduct.reviewsCount || 120})</span>
                    </div>
                    <div className="font-price-display text-price-display text-primary">
                      $ {Number(selectedProduct.price).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  {selectedProduct.description}
                </p>

                <div className="w-full h-px bg-white/10"></div>

                {/* Customization */}
                <div className="flex flex-col gap-md">
                  <h3 className="font-title-md text-title-md text-on-surface mb-2">Personalizar</h3>

                  {/* Size Selector */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body-lg text-body-lg text-on-surface">Tamaño</span>
                    <div className="flex gap-2 bg-surface-container-high/50 p-1 rounded-full">
                      {['Regular', 'Grande', 'X Grande'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={`px-4 py-2 rounded-full font-label-bold text-xs transition-all ${
                            size === s
                              ? 'bg-primary text-on-primary font-bold'
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="font-body-lg text-body-lg text-on-surface group-hover:text-primary transition-colors">Queso Extra (+$0.50)</span>
                      <button
                        type="button"
                        onClick={() => setAddCheese(!addCheese)}
                        className={`relative w-12 h-6 rounded-full border transition-colors ${
                          addCheese ? 'bg-primary/30 border-primary' : 'bg-surface-container-high border-white/10'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${
                            addCheese ? 'right-1 bg-primary' : 'left-1 bg-on-surface-variant'
                          }`}
                        ></div>
                      </button>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="font-body-lg text-body-lg text-on-surface group-hover:text-primary transition-colors">Medallón Extra (+$2.00)</span>
                      <button
                        type="button"
                        onClick={() => setExtraPatty(!extraPatty)}
                        className={`relative w-12 h-6 rounded-full border transition-colors ${
                          extraPatty ? 'bg-primary/30 border-primary' : 'bg-surface-container-high border-white/10'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${
                            extraPatty ? 'right-1 bg-primary' : 'left-1 bg-on-surface-variant'
                          }`}
                        ></div>
                      </button>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="font-body-lg text-body-lg text-on-surface group-hover:text-primary transition-colors">Bacon Extra (+$1.00)</span>
                      <button
                        type="button"
                        onClick={() => setAddBacon(!addBacon)}
                        className={`relative w-12 h-6 rounded-full border transition-colors ${
                          addBacon ? 'bg-primary/30 border-primary' : 'bg-surface-container-high border-white/10'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${
                            addBacon ? 'right-1 bg-primary' : 'left-1 bg-on-surface-variant'
                          }`}
                        ></div>
                      </button>
                    </label>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </main>

        {/* Bottom Floating Bar */}
        <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto pb-safe z-50">
          <div className="relative px-container-padding pb-container-padding pt-4 flex items-center justify-between gap-4 bg-surface-container-low/95 border-t border-white/10">
            {/* Quantity Selector */}
            <div className="bg-surface-container-high rounded-full flex items-center p-1 h-[56px]">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-white/10 transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">remove</span>
              </button>
              <span className="w-8 text-center font-title-md text-title-md text-on-surface">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-white/10 transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">add</span>
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-[56px] rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold flex items-center justify-between px-6 shadow-md transition-all"
            >
              <span className="font-title-md text-title-md text-on-primary">Agregar al Carrito</span>
              <div className="w-px h-8 bg-on-primary/20 mx-2"></div>
              <span className="font-price-display text-price-display text-on-primary">$ {totalPrice}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
