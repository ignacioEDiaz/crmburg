import React from 'react';
import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';

export default function CrmSidebar() {
  const { crmTab, setCrmTab, isCrmMobileSidebarOpen, setIsCrmMobileSidebarOpen } = useApp();

  const navItems = [
    { id: 'daily-orders', label: 'Pedidos del Día', icon: 'notifications_active' },
    { id: 'reports', label: 'Reportes y Estadísticas', icon: 'analytics' },
    { id: 'coupons', label: 'Cupones de Descuento', icon: 'confirmation_number' },
    { id: 'offers', label: 'Ofertas Personalizadas', icon: 'local_offer' },
    { id: 'dashboard', label: 'Panel Principal', icon: 'grid_view' },
    { id: 'menu', label: 'Menú y Categorías', icon: 'restaurant_menu' },
    { id: 'monthly-orders', label: 'Historial Pedidos', icon: 'calendar_month' },
    { id: 'inventory', label: 'Inventario', icon: 'inventory_2' },
    { id: 'customers', label: 'Clientes', icon: 'group' },
    { id: 'settings', label: 'Configuración', icon: 'settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isCrmMobileSidebarOpen && (
        <div
          onClick={() => setIsCrmMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden print:hidden"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed left-0 top-12 h-[calc(100vh-3rem)] w-72 bg-[#1c1c1e] border-r border-white/10 z-50 flex flex-col pt-lg pb-xl transition-transform duration-300 print:hidden ${
          isCrmMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header & Mobile Close Button */}
        <div className="px-lg mb-xl flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary text-[32px]">lunch_dining</span>
            <span className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
              BURGER<span className="text-primary">CRM</span>
            </span>
          </div>

          <button
            onClick={() => setIsCrmMobileSidebarOpen(false)}
            className="lg:hidden w-8 h-8 rounded-full bg-[#2c2c2e] border border-white/10 text-white flex items-center justify-center hover:bg-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-md space-y-xs overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = crmTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCrmTab(item.id);
                  setIsCrmMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center px-md py-md rounded-xl transition-all font-body-lg text-left ${
                  isActive
                    ? 'bg-primary text-on-primary font-bold shadow-md'
                    : 'text-on-surface-variant hover:bg-surface-container-highest/50 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined mr-md">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
