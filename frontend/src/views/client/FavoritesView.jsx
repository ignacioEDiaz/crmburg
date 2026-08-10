import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Heart } from 'lucide-react';

export default function FavoritesView() {
  const { products, setSelectedProduct, addToCart, setClientTab } = useApp();
  const favProducts = products.slice(0, 3);

  return (
    <div className="relative w-full max-w-7xl mx-auto min-h-screen bg-[#121212] font-body-lg text-white pb-12 pt-20 px-4 md:px-8 shadow-2xl">
      <div className="flex flex-col gap-lg">
        
        {/* Back to Home Header Button */}
        <div className="flex items-center justify-between border-b border-white/10 pb-md">
          <button
            onClick={() => setClientTab('home')}
            className="flex items-center gap-2 text-xs font-bold text-[#ffb700] bg-[#ffb700]/10 hover:bg-[#ffb700]/20 border border-[#ffb700]/30 px-4 py-2 rounded-full transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </button>
          <span className="text-xs text-secondary font-bold">Mis Favoritos</span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-headline-xl text-headline-xl text-white font-black">Tus Platos Favoritos</h2>
            <Heart className="w-6 h-6 text-[#ffb700] fill-[#ffb700]" />
          </div>
          <p className="text-body-sm text-secondary mt-xs">Tus comidas guardadas preferidas para pedir rápidamente.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg">
          {favProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className="bg-[#242426] border border-white/10 rounded-3xl p-lg flex flex-col justify-between cursor-pointer hover:bg-[#2c2c2e] hover:border-[#ffb700]/40 transition-all shadow-md group"
            >
              <div className="w-full h-40 relative flex items-center justify-center p-2 mb-2">
                <img src={p.image} alt={p.name} className="h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform" />
              </div>
              
              <div className="flex flex-col gap-xs pt-3 border-t border-white/10">
                <h3 className="font-bold text-title-md text-white truncate">{p.name}</h3>
                <p className="text-xs text-secondary line-clamp-2">{p.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-price-display text-[#ffb700] font-black text-xl">$ {Number(p.price).toFixed(2)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p, 1);
                    }}
                    className="w-9 h-9 rounded-full bg-[#ffb700] text-black font-black flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
