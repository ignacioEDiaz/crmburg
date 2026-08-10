import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import ItemDetailModal from './ItemDetailModal';

export default function HomeView() {
  const { products, categories, offers, setSelectedProduct, selectedProduct, addToCart, clientTab, setClientTab } = useApp();
  const [activeCategory, setActiveCategory] = useState('Hamburguesas');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([2]);

  // Ref for smooth category scrolling
  const categoryContainerRef = useRef(null);

  // Carousel State for Offers
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  // Helper to map category name to material icon
  const getCategoryIcon = (name) => {
    const lower = (name || '').toLowerCase();
    if (lower === 'todas') return 'grid_view';
    if (lower.includes('hamburguesa')) return 'lunch_dining';
    if (lower.includes('pizza')) return 'local_pizza';
    if (lower.includes('pollo')) return 'set_meal';
    if (lower.includes('papa')) return 'fastfood';
    if (lower.includes('bebida')) return 'local_bar';
    return 'flatware';
  };

  // Auto-rotate offers every 5 seconds
  useEffect(() => {
    if (offers.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [offers.length]);

  const nextOffer = () => {
    if (offers.length > 0) {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }
  };

  const prevOffer = () => {
    if (offers.length > 0) {
      setCurrentOfferIndex((prev) => (prev - 1 + offers.length) % offers.length);
    }
  };

  const scrollLeftCategory = () => {
    if (categoryContainerRef.current) {
      categoryContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRightCategory = () => {
    if (categoryContainerRef.current) {
      categoryContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  const toggleFavorite = (e, productId) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'Todas' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeOffer = offers[currentOfferIndex] || {
    id: 99,
    title: 'Combo CRASH Burger Picante',
    productName: 'Hamburguesa de Pollo Picante',
    offerPrice: 4.99,
    originalPrice: 6.49,
    discountBadge: '20% OFF',
    description: 'Oferta especial por tiempo limitado',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png'
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto min-h-screen bg-[#121212] font-body-lg text-white pb-12 pt-16 px-4 md:px-8 shadow-2xl">
      
      {/* Dark Ambient Golden Amber Glow */}
      <div className="dark-ambient-glow"></div>

      <main className="relative w-full pt-2 min-h-screen bg-transparent">
        <div className="flex flex-col w-full gap-xl">
          
          {/* Top Bar Greeting with CRASH Mascot Logo */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-md pt-2">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[3px] bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 shadow-xl shrink-0">
                <img src="/logo.png" alt="CRASH Mascot" className="w-full h-full rounded-full object-cover bg-black" />
              </div>

              <div>
                <p className="text-secondary text-xs sm:text-sm font-bold">¡Bienvenido a <span className="text-[#ffb700] font-black">CRASH BURGERS</span>! 👋</p>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5 tracking-tight">
                  ¡Buena Comida, <span className="text-[#ffb700] font-black">Buen Humor!</span>
                </h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96 h-14 rounded-full bg-[#242426] border border-white/10 flex items-center px-md shadow-inner">
              <span className="material-symbols-outlined text-secondary mr-sm">search</span>
              <input
                type="text"
                placeholder="Buscar tu hamburguesa favorita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-body-lg text-body-sm text-white placeholder-secondary"
              />
              <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors ml-sm text-secondary">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </button>
            </div>
          </div>

          {/* Categories Navigation Bar (Exactly 3 items visible per screen on mobile + smaller icons + Gold Accent) */}
          <div className="relative flex items-center gap-1.5 w-full bg-[#18181b]/80 p-1.5 rounded-3xl border border-white/5 shadow-md">
            {/* Left Scroll Arrow */}
            <button
              onClick={scrollLeftCategory}
              className="w-8 h-8 rounded-full bg-[#242426] border border-white/10 flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black transition-colors shrink-0 shadow-md active:scale-95 z-10"
              title="Categorías anteriores"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>

            {/* Scrollable Categories Container */}
            <div
              ref={categoryContainerRef}
              className="flex-1 flex items-center gap-2 overflow-x-auto py-1 px-0.5 hide-scrollbar scroll-smooth"
            >
              {['Todas', ...categories.map(c => c.name)].map((catName) => {
                const isActive = activeCategory === catName;
                return (
                  <button
                    key={catName}
                    onClick={() => setActiveCategory(catName)}
                    className={`flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-2xl border transition-all shrink-0 w-[calc((100%-16px)/3)] sm:w-auto sm:min-w-[120px] ${
                      isActive
                        ? 'bg-[#242426] border-[#ffb700] text-[#ffb700] shadow-md ring-1 ring-[#ffb700]/40'
                        : 'bg-[#242426]/60 border-white/10 text-secondary hover:text-white hover:bg-[#2c2c2e]'
                    }`}
                  >
                    {/* Category Icon */}
                    <span className={`material-symbols-outlined text-[18px] sm:text-[20px] transition-transform ${isActive ? 'text-[#ffb700] scale-110' : 'text-secondary'}`}>
                      {getCategoryIcon(catName)}
                    </span>

                    {/* Category Title in Uppercase */}
                    <span className={`font-black text-[10px] sm:text-[11px] tracking-wider uppercase text-center truncate w-full ${isActive ? 'text-[#ffb700]' : 'text-secondary'}`}>
                      {catName}
                    </span>

                    {/* Active Underline Pill */}
                    {isActive && (
                      <span className="w-5 h-0.5 rounded-full bg-[#ffb700] mt-0.5 shadow-sm"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Arrow */}
            <button
              onClick={scrollRightCategory}
              className="w-8 h-8 rounded-full bg-[#242426] border border-white/10 flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black transition-colors shrink-0 shadow-md active:scale-95 z-10"
              title="Siguientes categorías"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          {/* Offers Banner Carousel with Gold CRASH Branding */}
          <div className="relative w-full rounded-3xl bg-[#242426] border border-white/10 p-lg md:p-xl flex flex-col gap-sm shadow-xl transition-all overflow-hidden">
            
            {/* Larger Crash Watermark Background in Banner */}
            <div className="absolute right-0 bottom-0 top-0 w-2/3 pointer-events-none opacity-[0.09] flex items-center justify-end pr-2 overflow-hidden select-none">
              <img src="/crash-silhouette.png" alt="" className="h-[140%] object-contain filter invert scale-125 translate-y-4" />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-md min-h-[160px]">
              <div className="flex flex-col gap-xs relative z-10 w-full md:w-[60%]">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[#ffb700] text-[16px]">local_fire_department</span>
                  <span className="font-label-bold text-label-bold text-[#ffb700] font-black uppercase tracking-wider">{activeOffer.discountBadge || 'Oferta Exclusiva CRASH'}</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                  {activeOffer.title}
                </h3>

                <p className="text-xs md:text-sm text-secondary line-clamp-2 mt-1">{activeOffer.description}</p>

                <div className="flex items-baseline gap-3 mt-2">
                  <span className="font-price-display text-[#ffb700] font-black text-3xl">$ {Number(activeOffer.offerPrice || 4.99).toFixed(2)}</span>
                  {activeOffer.originalPrice && (
                    <span className="line-through text-sm text-secondary font-bold">$ {Number(activeOffer.originalPrice).toFixed(2)}</span>
                  )}
                </div>

                <button
                  onClick={() => {
                    const matchedProduct = products.find(p => p.name.toLowerCase() === (activeOffer.productName || '').toLowerCase()) || products[0];
                    if (matchedProduct) {
                      addToCart({ ...matchedProduct, price: Number(activeOffer.offerPrice) }, 1);
                    }
                  }}
                  className="mt-md bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-xs px-xl py-md rounded-full w-max shadow-lg hover:scale-105 transition-transform uppercase tracking-wider"
                >
                  Pedir Ahora
                </button>
              </div>

              <div className="relative w-full md:w-[40%] h-44 md:h-52 z-10 flex items-center justify-center">
                <div className="absolute top-0 right-0 md:top-2 md:right-4 px-4 py-2 rounded-full bg-black/60 border border-[#ffb700]/40 flex items-center justify-center shadow-lg z-20 backdrop-blur-md">
                  <span className="font-label-bold text-xs text-[#ffb700] font-black">{activeOffer.discountBadge || 'CRASH OFF'}</span>
                </div>
                <img
                  src={activeOffer.image}
                  alt={activeOffer.title}
                  className="w-full h-full object-contain drop-shadow-2xl transition-all duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Carousel Controls: Indicators & Navigation Arrows */}
            <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-2 relative z-10">
              <div className="flex items-center gap-2">
                {(offers.length > 0 ? offers : [1]).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentOfferIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentOfferIndex === idx ? 'w-8 bg-[#ffb700]' : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevOffer}
                  className="w-9 h-9 rounded-full bg-[#18181b] border border-white/10 flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black transition-colors"
                  title="Anterior oferta"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>

                <button
                  onClick={nextOffer}
                  className="w-9 h-9 rounded-full bg-[#18181b] border border-white/10 flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black transition-colors"
                  title="Siguiente oferta"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>

          </div>

          {/* Grid Section of Products */}
          <div className="flex flex-col gap-md">
            <div className="flex items-center justify-between">
              <h3 className="font-title-md text-headline-lg text-white font-black">
                {activeCategory === 'Todas' ? 'Todos los Productos CRASH' : activeCategory} ({filteredProducts.length})
              </h3>
              {activeCategory !== 'Todas' && (
                <button
                  onClick={() => setActiveCategory('Todas')}
                  className="font-label-bold text-label-bold text-secondary hover:text-[#ffb700] transition-colors text-sm font-bold"
                >
                  Ver Todas
                </button>
              )}
            </div>

            {/* Responsive Desktop Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg w-full pb-8">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full bg-[#242426] p-8 rounded-3xl text-center text-secondary text-sm border border-white/10">
                  No hay productos disponibles en la categoría "{activeCategory}".
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const isFav = favorites.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="relative w-full rounded-3xl bg-[#242426] border border-white/10 p-lg flex flex-col justify-between shadow-lg cursor-pointer hover:bg-[#2c2c2e] hover:border-[#ffb700]/40 transition-all group overflow-hidden"
                    >
                      {/* Prominent Large Crash Watermark Silhouette in Card Background */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.11] overflow-hidden select-none">
                        <img src="/crash-silhouette.png" alt="" className="w-full h-full object-contain filter invert scale-150 translate-y-6" />
                      </div>

                      {/* Optional Tag */}
                      {product.tag && (
                        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-[#ffb700]/20 border border-[#ffb700]/40 flex items-center justify-center">
                          <span className="text-[10px] font-black text-[#ffb700] uppercase tracking-wider">{product.tag}</span>
                        </div>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(e, product.id)}
                        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/40 flex items-center justify-center border border-white/10 hover:bg-black/60 transition-colors"
                      >
                        <span
                          className={`material-symbols-outlined text-[20px] ${isFav ? 'text-[#ffb700]' : 'text-white'}`}
                          style={{ fontVariationSettings: isFav ? '"FILL" 1' : '"FILL" 0' }}
                        >
                          favorite
                        </span>
                      </button>

                      {/* Prominent Large Product Image */}
                      <div className="w-full h-44 relative shrink-0 bg-transparent flex items-center justify-center my-2 p-2 z-10">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300 z-10"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex flex-col gap-xs pt-3 border-t border-white/10 relative z-10">
                        <h4 className="font-extrabold text-title-md text-white line-clamp-1 leading-tight">
                          {product.name}
                        </h4>
                        <p className="text-body-sm text-secondary text-xs line-clamp-2 mt-1">
                          {product.description}
                        </p>
                        
                        {/* Rating Gold Stars & Price */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-0.5 text-[#ffb700] text-xs font-bold">
                            <span>★</span>
                            <span>★</span>
                            <span>★</span>
                            <span>★</span>
                            <span className="text-secondary opacity-60">☆</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-price-display text-price-display text-[#ffb700] font-black text-xl">
                              ${Number(product.price).toFixed(2)}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product, 1);
                              }}
                              className="w-10 h-10 rounded-full bg-[#ffb700] text-black font-black flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform"
                            >
                              <span className="material-symbols-outlined text-[22px]">add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Item Detail Modal */}
      {selectedProduct && <ItemDetailModal />}

    </div>
  );
}
