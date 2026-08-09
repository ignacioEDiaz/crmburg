import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Tag, Flame } from 'lucide-react';

export default function OffersView() {
  const { offers, addToCart, setClientTab, setSelectedProduct, products } = useApp();

  return (
    <div className="relative w-full max-w-7xl mx-auto min-h-screen bg-[#161616] font-body-lg text-white pb-12 pt-20 px-4 md:px-8 shadow-2xl">
      <div className="flex flex-col gap-lg">
        
        {/* Back to Home Header Button */}
        <div className="flex items-center justify-between border-b border-white/10 pb-md">
          <button
            onClick={() => setClientTab('home')}
            className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/30 px-4 py-2 rounded-full transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </button>
          <span className="text-xs text-secondary font-bold">Ofertas Exclusivas</span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-headline-xl text-headline-xl text-white">Ofertas Especiales</h2>
            <Flame className="w-6 h-6 text-primary fill-primary" />
          </div>
          <p className="text-body-sm text-secondary mt-xs">Descuentos exclusivos y promociones administradas por la tienda.</p>
        </div>

        {offers.length === 0 ? (
          <div className="bg-[#242426] border border-white/10 rounded-3xl p-lg text-center text-secondary text-sm">
            No hay ofertas promocionales disponibles en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {offers.map((off) => {
              const matchedProduct = products.find(p => p.name.toLowerCase() === off.productName.toLowerCase()) || products[0];

              return (
                <div
                  key={off.id}
                  onClick={() => matchedProduct && setSelectedProduct(matchedProduct)}
                  className="bg-[#242426] border border-white/10 rounded-3xl p-lg flex flex-col justify-between cursor-pointer hover:bg-[#2c2c2e] transition-all shadow-lg relative group overflow-hidden"
                >
                  {/* Badge & Stock Header */}
                  <div className="flex justify-between items-center mb-sm">
                    <span className="px-3 py-1 rounded-full bg-primary text-white font-black text-xs shadow-md">
                      {off.discountBadge}
                    </span>

                    {off.stockQuantity && (
                      <span className="text-xs text-secondary font-bold">
                        Quedan {off.stockQuantity} un.
                      </span>
                    )}
                  </div>

                  {/* Offer Image (Large & Transparent) */}
                  <div className="w-full h-44 relative shrink-0 rounded-2xl bg-transparent flex items-center justify-center p-2 my-2">
                    <img src={off.image} alt={off.title} className="h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform" />
                  </div>

                  {/* Offer Details */}
                  <div className="flex flex-col gap-xs pt-3 border-t border-white/10">
                    <h3 className="font-bold text-headline-lg text-white truncate">{off.title}</h3>
                    <p className="text-xs text-secondary line-clamp-2 mt-1">{off.description}</p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-price-display text-price-display text-primary font-black text-xl">$ {Number(off.offerPrice).toFixed(2)}</span>
                        {off.originalPrice && (
                          <span className="line-through text-xs text-secondary font-bold">$ {Number(off.originalPrice).toFixed(2)}</span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (matchedProduct) {
                            addToCart({ ...matchedProduct, price: Number(off.offerPrice) }, 1);
                          }
                        }}
                        className="px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-md hover:scale-105 transition-transform"
                      >
                        Aprovechar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
