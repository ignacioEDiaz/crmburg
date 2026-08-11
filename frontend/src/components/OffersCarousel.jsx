import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Flame, ShoppingBag } from 'lucide-react';

export default function OffersCarousel() {
  const { offers, products, addToCart, setSelectedProduct } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transparentImages, setTransparentImages] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  // Fallback rich offer data matching CRASH BURGERS menu
  const defaultOffers = [
    {
      id: 101,
      title: 'Promo Parejas 2x1 Doble Carne',
      productName: 'Doble Carne y Bacon Extra',
      offerPrice: 11.99,
      originalPrice: 17.98,
      discountBadge: '2x1 PROMO',
      description: 'Lleva dos hamburguesas dobles de res con queso cheddar y panceta por el precio de una y media.',
      image: '/images/burger-smash.jpg'
    },
    {
      id: 102,
      title: 'Combo CRASH Supreme Bacon',
      productName: 'Hamburguesa de Queso Clásica',
      offerPrice: 4.99,
      originalPrice: 6.99,
      discountBadge: '30% OFF',
      description: 'Doble medallón de carne vacuna, crocante bacon, cheddar fundido y salsa secreta CRASH.',
      image: '/images/burger-supreme.jpg'
    },
    {
      id: 103,
      title: 'Crispy Spicy Chicken Burger',
      productName: 'Hamburguesa de Pollo Picante',
      offerPrice: 5.49,
      originalPrice: 7.25,
      discountBadge: 'HOT DEAL 🔥',
      description: 'Medallón de pollo extra crujiente sazonado con especias picantes, pepinillos y lechuga fresca.',
      image: '/images/burger-chicken.jpg'
    }
  ];

  const rawOffers = offers && offers.length > 0 ? offers : defaultOffers;

  // Helper to ensure every offer has a valid, high-resolution burger image
  const resolveImage = (imgUrl, title = '') => {
    if (!imgUrl || imgUrl.trim() === '' || imgUrl.includes('wikimedia') || imgUrl.includes('example.com')) {
      const lower = (title || '').toLowerCase();
      if (lower.includes('chicken') || lower.includes('pollo')) return '/images/burger-chicken.jpg';
      if (lower.includes('smash') || lower.includes('doble') || lower.includes('pareja')) return '/images/burger-smash.jpg';
      return '/images/burger-supreme.jpg';
    }
    return imgUrl;
  };

  const displayOffers = rawOffers.map(off => ({
    ...off,
    image: resolveImage(off.image, off.title)
  }));

  // Smart Background Stripper: converts both white and dark square backgrounds into transparent PNGs
  useEffect(() => {
    displayOffers.forEach((offer) => {
      const src = offer.image;
      if (!src || transparentImages[src]) return;

      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = src;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const w = img.naturalWidth;
          const h = img.naturalHeight;
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;

          // Corner color sampling (top-left corner)
          const bgR = data[0];
          const bgG = data[1];
          const bgB = data[2];

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const distCorner = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
            const isWhite = r > 215 && g > 215 && b > 215;
            const isDarkBg = distCorner < 38;

            if (isWhite || isDarkBg) {
              data[i + 3] = 0;
            } else if (distCorner < 55) {
              const alpha = Math.max(0, (distCorner - 38) / 17) * 255;
              data[i + 3] = Math.min(data[i + 3], alpha);
            }
          }
          ctx.putImageData(imgData, 0, 0);
          const transparentUrl = canvas.toDataURL('image/png');
          setTransparentImages((prev) => ({ ...prev, [src]: transparentUrl }));
        } catch (e) {
          setTransparentImages((prev) => ({ ...prev, [src]: src }));
        }
      };
      img.onerror = () => {
        setTransparentImages((prev) => ({ ...prev, [src]: src }));
      };
    });
  }, [displayOffers]);

  // Auto-rotate every 5 seconds when not hovered
  useEffect(() => {
    if (isHovered || displayOffers.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayOffers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayOffers.length, isHovered]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayOffers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayOffers.length) % displayOffers.length);
  };

  const activeOffer = displayOffers[currentIndex] || displayOffers[0];

  const currentOfferId = activeOffer.id || (100 + currentIndex);

  const offerItem = {
    id: currentOfferId,
    name: activeOffer.title || activeOffer.productName || 'Hamburguesa Especial',
    price: Number(activeOffer.offerPrice || 4.99),
    image: transparentImages[activeOffer.image] || activeOffer.image || '/images/burger-supreme.jpg',
    description: activeOffer.description || 'Oferta especial por tiempo limitado',
    category: 'Hamburguesas'
  };

  const matchedProduct = products.find(
    (p) => p.name.toLowerCase() === (activeOffer.productName || '').toLowerCase()
  ) || offerItem;

  return (
    <section 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-full bg-transparent px-0 py-2 flex flex-col items-center justify-between overflow-hidden"
    >
      {/* Ambient background glow behind massive central burger */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[650px] h-[90vw] max-h-[650px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. TOP CENTERED TITLE BANNER */}
      <div className="relative z-30 flex flex-col items-center text-center mt-1 w-full px-4">
        <div className="bg-[#1a1918] text-white px-5 sm:px-10 py-3 sm:py-4 rounded-2xl border border-white/15 shadow-2xl max-w-full sm:max-w-2xl">
          <h2 className="text-xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight text-white uppercase font-sans">
            {activeOffer.title}
          </h2>
        </div>

        {/* Badge & Price pills */}
        <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
          {activeOffer.discountBadge && (
            <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ffb700] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-md">
              <Flame className="w-3.5 h-3.5 fill-black" />
              {activeOffer.discountBadge}
            </span>
          )}
          <span className="font-price-display text-2xl sm:text-3xl font-black text-[#ffb700] tracking-tight">
            ${Number(activeOffer.offerPrice || 4.99).toFixed(2)}
          </span>
          {activeOffer.originalPrice && (
            <span className="line-through text-xs sm:text-base text-neutral-400 font-bold">
              ${Number(activeOffer.originalPrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* 2. FULL WIDTH CAROUSEL STAGE (NO INTERNAL VERTICAL SCROLLING, MINIMALIST ARROWS) */}
      <div className="relative w-full max-w-full flex items-center justify-center my-4 select-none h-[280px] sm:h-[380px] md:h-[460px] overflow-hidden">
        
        {/* Soft floor shadow under central burger */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[75vw] max-w-[500px] h-10 sm:h-14 bg-black/80 rounded-[100%] blur-2xl pointer-events-none z-10" />

        {/* Minimalist Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#ffb700] text-white/80 hover:text-black border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg transition-all z-50 active:scale-90"
          title="Anterior oferta"
        >
          <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
        </button>

        {/* Minimalist Right Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#ffb700] text-white/80 hover:text-black border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg transition-all z-50 active:scale-90"
          title="Siguiente oferta"
        >
          <ChevronRight className="w-5 h-5 stroke-[1.5]" />
        </button>

        {/* Render Carousel Burgers (Main Huge Center + Peeking Flanks) */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {displayOffers.map((item, index) => {
            const total = displayOffers.length;
            let offset = (index - currentIndex) % total;
            if (offset < 0) offset += total;
            if (offset > total / 2) offset -= total;

            const isCurrent = offset === 0;
            const isNext = offset === 1 || (total === 2 && offset === -1);
            const isPrev = offset === -1;

            if (!isCurrent && !isNext && !isPrev) return null;

            const imgSrc = transparentImages[item.image] || item.image || '/images/burger-supreme.jpg';

            let positionStyle = '';
            let zIndex = 10;
            let opacity = 1;

            if (isCurrent) {
              // Central Main Burger: MASSIVE, Eye-Catching Focal Point!
              positionStyle = 'translate-x-0 scale-110 sm:scale-125 md:scale-135 z-30 opacity-100';
              zIndex = 30;
            } else if (isNext) {
              // Right flank burger: Peeking in from right screen edge
              positionStyle = 'translate-x-[85%] sm:translate-x-[82%] scale-60 opacity-30 z-20';
              zIndex = 20;
              opacity = 0.3;
            } else if (isPrev) {
              // Left flank burger: Peeking in from left screen edge
              positionStyle = '-translate-x-[85%] sm:-translate-x-[82%] scale-60 opacity-30 z-20';
              zIndex = 20;
              opacity = 0.3;
            }

            return (
              <div
                key={item.id || index}
                onClick={() => {
                  if (isCurrent) {
                    setSelectedProduct(offerItem);
                  } else {
                    setCurrentIndex(index);
                  }
                }}
                className={`absolute transition-all duration-700 ease-out flex items-center justify-center cursor-pointer ${positionStyle}`}
                style={{ zIndex, opacity }}
                title={isCurrent ? 'Ver detalles de la oferta' : 'Ver siguiente oferta'}
              >
                <div className="relative flex flex-col items-center">
                  <img
                    src={imgSrc}
                    alt={item.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/burger-supreme.jpg';
                    }}
                    style={{
                      WebkitMaskImage: 'radial-gradient(circle at center, black 58%, transparent 92%)',
                      maskImage: 'radial-gradient(circle at center, black 58%, transparent 92%)'
                    }}
                    className={`w-[78vw] sm:w-[480px] md:w-[580px] lg:w-[640px] h-[78vw] sm:h-[480px] md:h-[580px] lg:h-[640px] max-w-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.9)] transition-all duration-700 ${
                      isCurrent ? 'animate-float hover:scale-105' : 'hover:scale-110'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 3. BOTTOM CENTERED BUTTON BAR */}
      <div className="relative z-30 mt-2 inline-flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-[#1a1918] border border-white/15 rounded-full sm:rounded-3xl shadow-2xl max-w-full px-4">
        <button
          onClick={() => {
            addToCart(offerItem, 1);
          }}
          className="px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-[#ffb700] hover:bg-yellow-400 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
        >
          <ShoppingBag className="w-4 h-4 text-black stroke-[2.5]" />
          PEDIR AHORA
        </button>

        <button
          onClick={() => setSelectedProduct(offerItem)}
          className="px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-[#2a2a2d] hover:bg-[#353539] text-white font-bold text-xs sm:text-sm border border-white/10 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          Ver Detalles
        </button>
      </div>

    </section>
  );
}
