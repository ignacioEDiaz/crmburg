import React from 'react';
import { useApp } from './context/AppContext';
import NavigationHeader from './components/NavigationHeader';
import CartDrawer from './components/CartDrawer';

// Client Views
import HomeView from './views/client/HomeView';
import OffersView from './views/client/OffersView';
import OrdersTrackerView from './views/client/OrdersTrackerView';
import FavoritesView from './views/client/FavoritesView';

// CRM Views
import CrmSidebar from './views/crm/CrmSidebar';
import CrmHeader from './views/crm/CrmHeader';
import CrmDailyOrdersView from './views/crm/CrmDailyOrdersView';
import CrmReportsView from './views/crm/CrmReportsView';
import CrmCouponsView from './views/crm/CrmCouponsView';
import CrmOffersView from './views/crm/CrmOffersView';
import CrmDashboardView from './views/crm/CrmDashboardView';
import CrmMenuCategoriesView from './views/crm/CrmMenuCategoriesView';
import CrmMonthlyOrdersView from './views/crm/CrmMonthlyOrdersView';
import CrmInventoryView from './views/crm/CrmInventoryView';
import CrmCustomersView from './views/crm/CrmCustomersView';
import CrmSettingsView from './views/crm/CrmSettingsView';

export default function App() {
  const { currentMode, clientTab, crmTab, isCartOpen, setIsCartOpen } = useApp();

  return (
    <div className="min-h-screen bg-background font-body-lg text-on-background">
      {/* Top Mode Switcher Header */}
      <NavigationHeader />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {currentMode === 'client' ? (
        <div className="pt-8">
          {clientTab === 'home' && <HomeView />}
          {clientTab === 'offers' && <OffersView />}
          {clientTab === 'orders' && <OrdersTrackerView />}
          {clientTab === 'favorites' && <FavoritesView />}
        </div>
      ) : (
        <div className="min-h-screen bg-[#121212] font-body-lg text-on-surface relative">
          <CrmSidebar />
          <div className="pl-0 lg:pl-72 pt-12 print:pl-0 print:pt-0 w-full transition-all">
            <CrmHeader />
            <main className="relative pt-20 min-h-screen px-4 md:px-xl pb-xl bg-[#121212] print:pt-0 print:p-0 print:bg-white w-full overflow-x-hidden">
              
              {/* Subtle Crash Watermark Silhouette in CRM Background */}
              <div className="fixed right-10 bottom-10 pointer-events-none opacity-[0.05] z-0 select-none hidden md:flex items-center justify-center">
                <img src="/crash-silhouette.png" alt="" className="w-[500px] h-[500px] object-contain filter invert" />
              </div>

              <div className="relative z-10">
                {crmTab === 'daily-orders' && <CrmDailyOrdersView />}
                {crmTab === 'reports' && <CrmReportsView />}
                {crmTab === 'coupons' && <CrmCouponsView />}
                {crmTab === 'offers' && <CrmOffersView />}
                {crmTab === 'dashboard' && <CrmDashboardView />}
                {crmTab === 'menu' && <CrmMenuCategoriesView />}
                {crmTab === 'monthly-orders' && <CrmMonthlyOrdersView />}
                {crmTab === 'inventory' && <CrmInventoryView />}
                {crmTab === 'customers' && <CrmCustomersView />}
                {crmTab === 'settings' && <CrmSettingsView />}
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
