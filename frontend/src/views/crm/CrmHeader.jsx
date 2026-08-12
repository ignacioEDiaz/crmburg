import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu } from 'lucide-react';

export default function CrmHeader() {
  const { crmTab, setIsCrmMobileSidebarOpen } = useApp();

  const tabTitles = {
    'express-pos': 'Mostrador Express POS (Caja)',
    'daily-orders': 'Pedidos del Día (Tiempo Real)',
    'reports': 'Reportes y Estadísticas',
    'coupons': 'Cupones de Descuento',
    'offers': 'Ofertas Personalizadas',
    'dashboard': 'Panel Principal',
    'menu': 'Menú y Categorías',
    'monthly-orders': 'Historial Pedidos',
    'inventory': 'Inventario',
    'customers': 'Clientes',
    'settings': 'Configuración',
  };

  return (
    <header className="fixed top-12 left-0 lg:left-72 right-0 h-16 bg-[#18181b]/90 backdrop-blur-md border-b border-white/5 z-30 px-4 md:px-xl flex items-center justify-between shadow-sm print:hidden">
      
      {/* Mobile Hamburger Button + Section Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsCrmMobileSidebarOpen(true)}
          className="lg:hidden w-9 h-9 rounded-full bg-[#242426] border border-white/10 text-white flex items-center justify-center hover:bg-[#ffb700] hover:text-black transition-colors shrink-0"
          title="Abrir Menú CRM"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="font-title-lg text-title-lg text-on-surface truncate font-black text-sm md:text-base">
          {tabTitles[crmTab] || 'CRM Dashboard'}
        </h2>
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-md">
        <div className="relative">
          <button className="w-10 h-10 rounded-full bg-[#242426] border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-[#ffb700] transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ffb700]"></span>
          </button>
        </div>

        <div className="flex items-center gap-sm border-l border-white/10 pl-md">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Admin Avatar"
            className="w-9 h-9 rounded-full object-cover border border-white/10"
          />
          <div className="hidden sm:block">
            <p className="font-label-bold text-xs text-on-surface font-bold">Admin Tienda</p>
            <p className="text-[10px] text-on-surface-variant">Gerente General</p>
          </div>
        </div>
      </div>
    </header>
  );
}
