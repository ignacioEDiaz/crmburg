import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, LayoutDashboard, Smartphone, Home, Tag, ReceiptText, Heart } from 'lucide-react';

export default function NavigationHeader() {
  const { currentMode, setCurrentMode, clientTab, setClientTab, cart, setIsCartOpen, toastMessage } = useApp();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-md print:hidden w-full">
      
      {/* Brand Logo & Desktop Client Navigation */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div 
          onClick={() => { setCurrentMode('client'); setClientTab('home'); }}
          className="flex items-center gap-2 font-black text-primary text-base sm:text-xl tracking-tight cursor-pointer hover:opacity-90 transition-opacity group"
        >
          {/* CRASH Fox Logo Image */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-amber-500 shadow-md group-hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="CRASH Logo"
              className="w-full h-full rounded-full object-cover bg-black"
            />
          </div>

          <span className="text-white flex items-center gap-1 font-black tracking-wide">
            <span>CRASH</span>
            <span className="text-primary">🍔</span>
          </span>
        </div>

        {/* Desktop Client Tabs */}
        {currentMode === 'client' && (
          <nav className="hidden md:flex items-center gap-2 border-l border-white/10 pl-4">
            <button
              onClick={() => setClientTab('home')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                clientTab === 'home' ? 'bg-primary text-black font-black shadow-md' : 'text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Inicio
            </button>

            <button
              onClick={() => setClientTab('offers')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                clientTab === 'offers' ? 'bg-primary text-black font-black shadow-md' : 'text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              Ofertas
            </button>

            <button
              onClick={() => setClientTab('orders')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                clientTab === 'orders' ? 'bg-primary text-black font-black shadow-md' : 'text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              <ReceiptText className="w-3.5 h-3.5" />
              Pedidos
            </button>

            <button
              onClick={() => setClientTab('favorites')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                clientTab === 'favorites' ? 'bg-primary text-black font-black shadow-md' : 'text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              Favoritos
            </button>
          </nav>
        )}
      </div>

      {/* Mode Switcher Buttons */}
      <div className="flex items-center bg-[#242426] border border-white/10 p-0.5 sm:p-1 rounded-full mx-1">
        <button
          onClick={() => setCurrentMode('client')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
            currentMode === 'client'
              ? 'bg-primary text-black font-extrabold shadow-md'
              : 'text-secondary hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
          <span className="sm:hidden">Cliente</span>
          <span className="hidden sm:inline">App Cliente</span>
        </button>

        <button
          onClick={() => setCurrentMode('crm')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
            currentMode === 'crm'
              ? 'bg-primary text-black font-extrabold shadow-md'
              : 'text-secondary hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
          <span className="sm:hidden">CRM</span>
          <span className="hidden sm:inline">CRM Dashboard</span>
        </button>
      </div>

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-primary text-black font-black text-xs px-5 py-2.5 rounded-full shadow-2xl z-50 animate-bounce print:hidden border border-white/20">
          {toastMessage}
        </div>
      )}

      {/* Cart Icon Button */}
      <div className="flex items-center shrink-0">
        {currentMode === 'client' && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#242426] border border-white/10 text-white hover:bg-primary hover:text-black transition-all shadow-md shrink-0 active:scale-95"
            title="Ver Carrito de Compras"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary text-black font-black text-[10px] sm:text-[11px] flex items-center justify-center shadow-md">
                {totalCartItems}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
