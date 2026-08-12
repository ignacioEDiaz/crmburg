import React from 'react';
import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';

export default function CrmSidebar() {
  const { crmTab, setCrmTab, isCrmMobileSidebarOpen, setIsCrmMobileSidebarOpen } = useApp();

  const navItems = [
    { id: 'express-pos', label: 'Mostrador Express', icon: 'point_of_sale' },
    { id: 'tables', label: 'Gestión de Mesas', icon: 'table_restaurant' },
    { id: 'daily-orders', label: 'Pedidos del Día', icon: 'notifications_active' },
    { id: 'reports', label: 'Reportes y Estadísticas', icon: 'analytics' },
    { id: 'coupons', label: 'Cupones de Descuento', icon: 'confirmation_number' },
    { id: 'offers', label: 'Ofertas Personalizadas', icon: 'local_offer' },
    { id: 'dashboard', label: 'Panel Principal', icon: 'grid_view' },
    { id: 'menu', label: 'Menú y Categorías', icon: 'restaurant_menu' },
    { id: 'monthly-orders', label: 'Historial Pedidos', icon: 'calendar_month' },
    { id: 'inventory', label: 'Inventario y Recetas', icon: 'inventory_2' },
    { id: 'suppliers-expenses', label: 'Proveedores y Gastos', icon: 'local_shipping' },
    { id: 'customers', label: 'Clientes / CRM', icon: 'group' },
    { id: 'users-roles', label: 'Usuarios & Auditoría', icon: 'badge' },
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
        className={`fixed left-0 top-12 h-[calc(100vh-3rem)] w-72 bg-[#18181b] border-r border-white/10 z-50 flex flex-col pt-lg pb-xl transition-transform duration-300 print:hidden ${
          isCrmMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header & Mobile Close Button */}
        <div className="px-lg mb-xl flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-amber-500 shadow-md shrink-0">
              <img src="/logo.png" alt="CRASH Logo" className="w-full h-full rounded-full object-cover bg-black" />
            </div>
            <span className="font-black text-headline-lg tracking-tight text-on-surface">
              CRASH<span className="text-[#ffb700]">CRM</span>
            </span>
          </div>

          <button
            onClick={() => setIsCrmMobileSidebarOpen(false)}
            className="lg:hidden w-8 h-8 rounded-full bg-[#2c2c2e] border border-white/10 text-white flex items-center justify-center hover:bg-[#ffb700] hover:text-black transition-colors"
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
                className={`w-full flex items-center px-md py-md rounded-2xl transition-all font-body-lg text-left ${
                  isActive
                    ? 'bg-[#ffb700] text-black font-black shadow-md'
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
