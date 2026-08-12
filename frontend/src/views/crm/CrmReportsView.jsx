import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, TrendingUp, Calendar, Filter, Flame, Package, Utensils, CheckCircle2, DollarSign, QrCode, CreditCard, Zap, User, Plus, X, Award, Smile, Coffee, Wine, GlassWater } from 'lucide-react';

export default function CrmReportsView() {
  const context = useApp() || {};
  const products = Array.isArray(context.products) ? context.products : [];
  const orders = Array.isArray(context.orders) ? context.orders : [];
  const showToast = typeof context.showToast === 'function' ? context.showToast : () => {};

  const [activeReportTab, setActiveReportTab] = useState('daily'); // 'daily' | 'waiters' | 'products'
  const [showAddWaitressModal, setShowAddWaitressModal] = useState(false);

  // Waitress Profiles State
  const [waitresses, setWaitresses] = useState([
    { id: 1, name: 'Sofía R.', shift: 'Noche', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', tablesCount: 14, totalSales: 184500, avgTicket: 13178 },
    { id: 2, name: 'Lucas M.', shift: 'Noche', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80', tablesCount: 10, totalSales: 128000, avgTicket: 12800 },
    { id: 3, name: 'Camila V.', shift: 'Mañana', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80', tablesCount: 12, totalSales: 145200, avgTicket: 12100 },
    { id: 4, name: 'Valentina B.', shift: 'Mañana', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80', tablesCount: 9, totalSales: 98400, avgTicket: 10933 },
  ]);

  // New Waitress Form
  const [newWaitressName, setNewWaitressName] = useState('');
  const [newWaitressShift, setNewWaitressShift] = useState('Noche');
  const [newWaitressAvatar, setNewWaitressAvatar] = useState('');

  // Daily Financial Calculations
  const todayOrders = orders; // All recorded orders
  const totalRevenueToday = todayOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const totalExpensesEst = totalRevenueToday * 0.35; // Est. 35% COGS & operating costs
  const netProfitToday = totalRevenueToday - totalExpensesEst;

  // Breakdown by Payment Method
  const cashSales = todayOrders.filter(o => o.paymentMethod === 'Efectivo').reduce((sum, o) => sum + Number(o.total || 0), 0);
  const mpSales = todayOrders.filter(o => o.paymentMethod === 'MercadoPago' || o.paymentMethod === 'MP / QR').reduce((sum, o) => sum + Number(o.total || 0), 0);
  const cardSales = todayOrders.filter(o => o.paymentMethod === 'Tarjeta').reduce((sum, o) => sum + Number(o.total || 0), 0);
  const transferSales = todayOrders.filter(o => o.paymentMethod === 'Transferencia').reduce((sum, o) => sum + Number(o.total || 0), 0);

  // Items Spent & Sold Today with High Visual Images (Hamburguesas, Tragos, Bebidas, Postres)
  const itemsMap = {};
  todayOrders.forEach(o => {
    let parsedItems = [];
    try {
      parsedItems = typeof o.itemsJson === 'string' ? JSON.parse(o.itemsJson) : (o.itemsJson || []);
    } catch (e) {
      parsedItems = [];
    }

    parsedItems.forEach(item => {
      const key = item.name || 'Producto';
      if (!itemsMap[key]) {
        const matchedProd = products.find(p => p.name.toLowerCase() === key.toLowerCase());
        itemsMap[key] = {
          name: key,
          qty: 0,
          revenue: 0,
          image: matchedProd?.image || 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80',
          category: matchedProd?.category || 'Consumo General'
        };
      }
      itemsMap[key].qty += (item.qty || item.quantity || 1);
      itemsMap[key].revenue += ((item.price || 0) * (item.qty || item.quantity || 1));
    });
  });

  // Default Fallback Visual Items (Tragos, Bebidas, Hamburguesas) if list is empty
  const visualSpentItems = Object.values(itemsMap).length > 0 ? Object.values(itemsMap) : [
    { name: 'Mojito Tropical Trago Especial', qty: 34, revenue: 16983, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80', category: 'Tragos y Coctelería' },
    { name: 'Combo CRASH Supreme Bacon', qty: 58, revenue: 40542, image: '/images/burger-supreme.jpg', category: 'Hamburguesas' },
    { name: 'Cerveza Patagonia Amber Ale 500ml', qty: 42, revenue: 18900, image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&auto=format&fit=crop&q=80', category: 'Bebidas' },
    { name: 'Promo Parejas 2x1 Doble Carne', qty: 28, revenue: 23520, image: '/images/burger-smash.jpg', category: 'Promos' },
    { name: 'Milkshake de Dulce de Leche', qty: 22, revenue: 9900, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80', category: 'Postres' },
    { name: 'Papas Bastón McCain Grandes', qty: 45, revenue: 15750, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80', category: 'Guarniciones' },
  ];

  // Handle Add New Waitress Profile
  const handleAddWaitress = (e) => {
    e.preventDefault();
    if (!newWaitressName.trim()) return;

    const newWaitressObj = {
      id: Date.now(),
      name: newWaitressName.trim(),
      shift: newWaitressShift,
      avatar: newWaitressAvatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      tablesCount: 0,
      totalSales: 0,
      avgTicket: 0
    };

    setWaitresses(prev => [...prev, newWaitressObj]);
    showToast(`👩‍🍳 Perfil de mesera "${newWaitressName}" creado`);
    setNewWaitressName('');
    setNewWaitressAvatar('');
    setShowAddWaitressModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full gap-lg font-sans print:p-0 print:bg-white print:text-black">
      
      {/* ================= MODAL: CREAR PERFIL DE MESERA ================= */}
      {showAddWaitressModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddWaitress} className="w-full max-w-md bg-[#18181b] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#ffb700]" />
                <h3 className="font-black text-white text-base">Crear Perfil de Mesera / Mozo</h3>
              </div>
              <button type="button" onClick={() => setShowAddWaitressModal(false)} className="w-8 h-8 rounded-full bg-[#242426] flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Nombre y Apellido:</label>
                <input
                  type="text"
                  placeholder="Ej. Sofía R., Lucas M..."
                  value={newWaitressName}
                  onChange={(e) => setNewWaitressName(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Turno Asignado:</label>
                <select
                  value={newWaitressShift}
                  onChange={(e) => setNewWaitressShift(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                >
                  <option value="Noche">Turno Noche 🌙</option>
                  <option value="Mañana">Turno Mañana / Mediodía ☀️</option>
                  <option value="Tarde">Turno Tarde ☕</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">URL de Foto / Avatar (Opcional):</label>
                <input
                  type="url"
                  placeholder="https://... URL de la foto de perfil"
                  value={newWaitressAvatar}
                  onChange={(e) => setNewWaitressAvatar(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 rounded-2xl bg-[#ffb700] text-black font-black text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors shadow-lg">
              👩‍🍳 REGISTRAR PERFIL DE MESERA
            </button>
          </form>
        </div>
      )}

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md border-b border-white/10 pb-4 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Reportes Financieros y Cierre Diario</h1>
          <p className="text-xs text-neutral-400 font-bold">Ganancias, gastos con fotos de ítems, resumen por medio de pago y meseras</p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-3 rounded-2xl bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <Printer className="w-5 h-5 text-black" />
          🖨️ IMPRIMIR CIERRE DIARIO Y MESAS
        </button>
      </div>

      {/* Tab Switcher: Daily Financials | Waitress Performance | Product Breakdown */}
      <div className="flex items-center gap-2 bg-[#18181b] p-1.5 rounded-2xl border border-white/10 overflow-x-auto hide-scrollbar print:hidden">
        <button
          onClick={() => setActiveReportTab('daily')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeReportTab === 'daily' ? 'bg-[#ffb700] text-black shadow-md' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Balance Diario & Gastos Visuales
        </button>

        <button
          onClick={() => setActiveReportTab('waiters')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeReportTab === 'waiters' ? 'bg-[#ffb700] text-black shadow-md' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          Resumen de Mesas por Mesera ({waitresses.length})
        </button>

        <button
          onClick={() => setActiveReportTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeReportTab === 'products' ? 'bg-[#ffb700] text-black shadow-md' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          Ranking de Ventas
        </button>
      </div>

      {/* ================= TAB 1: DAILY BALANCE & VISUAL SPENT ITEMS ================= */}
      {activeReportTab === 'daily' && (
        <div className="space-y-lg">
          
          {/* Top Financial Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
            <div className="bg-[#18181b] border border-emerald-500/30 p-5 rounded-3xl flex items-center justify-between shadow-xl">
              <div>
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Recaudación Total Hoy</p>
                <p className="text-3xl font-black text-emerald-300 font-mono mt-1">$ {totalRevenueToday.toFixed(2)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-emerald-400/50" />
            </div>

            <div className="bg-[#18181b] border border-rose-500/30 p-5 rounded-3xl flex items-center justify-between shadow-xl">
              <div>
                <p className="text-xs text-rose-400 font-bold uppercase tracking-wider">Gastos / Costos Est. Hoy</p>
                <p className="text-3xl font-black text-rose-300 font-mono mt-1">$ {totalExpensesEst.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-rose-400/50" />
            </div>

            <div className="bg-[#18181b] border border-[#ffb700]/40 p-5 rounded-3xl flex items-center justify-between shadow-xl">
              <div>
                <p className="text-xs text-[#ffb700] font-bold uppercase tracking-wider">Ganancia Neta Limpia</p>
                <p className="text-3xl font-black text-[#ffb700] font-mono mt-1">$ {netProfitToday.toFixed(2)}</p>
              </div>
              <Award className="w-10 h-10 text-[#ffb700]/50" />
            </div>
          </div>

          {/* Payment Method Breakdown Cards */}
          <div className="bg-[#18181b] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-black text-white text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#ffb700]" />
              Desglose de Ingresos por Medio de Pago Hoy
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
              <div className="bg-[#242426] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-xs text-neutral-400 font-bold flex items-center gap-1">
                  💵 Efectivo:
                </span>
                <p className="text-xl font-black text-emerald-400 font-mono">$ {cashSales.toFixed(2)}</p>
              </div>

              <div className="bg-[#242426] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-xs text-neutral-400 font-bold flex items-center gap-1">
                  📱 MercadoPago / QR:
                </span>
                <p className="text-xl font-black text-sky-400 font-mono">$ {mpSales.toFixed(2)}</p>
              </div>

              <div className="bg-[#242426] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-xs text-neutral-400 font-bold flex items-center gap-1">
                  💳 Tarjeta Débito/Crédito:
                </span>
                <p className="text-xl font-black text-amber-400 font-mono">$ {cardSales.toFixed(2)}</p>
              </div>

              <div className="bg-[#242426] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-xs text-neutral-400 font-bold flex items-center gap-1">
                  🏦 Transferencia:
                </span>
                <p className="text-xl font-black text-purple-400 font-mono">$ {transferSales.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* VISUAL SPENT ITEMS GALLERY (Tragos, Hamburguesas, Insumos con FOTO GRANDE) */}
          <div className="bg-[#18181b] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-white text-lg flex items-center gap-2">
                  <Wine className="w-5 h-5 text-[#ffb700]" />
                  Ítems Consumidos y Gastados Hoy (Tragos, Comidas y Bebidas)
                </h3>
                <p className="text-xs text-neutral-400 font-bold">Desglose gráfico con foto para visualizar rápido el consumo del día</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-md">
              {visualSpentItems.map((item, idx) => (
                <div key={idx} className="bg-[#242426] border border-white/10 rounded-3xl p-4 flex flex-col justify-between shadow-lg">
                  {/* Large Product Image */}
                  <div className="w-full h-40 rounded-2xl bg-black/40 overflow-hidden mb-3 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#ffb700] uppercase tracking-wider">{item.category}</span>
                    <h4 className="font-extrabold text-white text-sm line-clamp-1">{item.name}</h4>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-2">
                      <span className="text-xs text-neutral-400 font-bold">Consumido hoy:</span>
                      <span className="bg-[#ffb700] text-black font-black text-xs px-3 py-1 rounded-full shadow">
                        {item.qty} unidades
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-neutral-400 font-bold">Subtotal:</span>
                      <span className="font-mono text-emerald-400 font-black text-base">$ {item.revenue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 2: RESUMEN DE MESAS POR MESERA ================= */}
      {activeReportTab === 'waiters' && (
        <div className="space-y-lg">
          
          <div className="flex items-center justify-between bg-[#18181b] p-5 rounded-3xl border border-white/10">
            <div>
              <h3 className="font-black text-white text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-[#ffb700]" />
                Rendimiento de Meseras y Mozos
              </h3>
              <p className="text-xs text-neutral-400 font-bold">Desglose de mesas atendidas, ventas generadas y ticket promedio por perfil</p>
            </div>

            <button
              onClick={() => setShowAddWaitressModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 text-black stroke-[3]" />
              + Crear Perfil de Mesera
            </button>
          </div>

          {/* Waitresses Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {waitresses.map((w) => (
              <div key={w.id} className="bg-[#18181b] border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl space-y-4">
                
                {/* Profile Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <img src={w.avatar} alt={w.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-[#ffb700]" />
                    <div>
                      <h4 className="font-black text-white text-lg">{w.name}</h4>
                      <span className="text-xs text-[#ffb700] font-bold bg-[#ffb700]/10 px-2.5 py-0.5 rounded-full border border-[#ffb700]/30">
                        {w.shift === 'Noche' ? 'Turno Noche 🌙' : 'Turno Mañana ☀️'}
                      </span>
                    </div>
                  </div>

                  <span className="bg-emerald-500/20 text-emerald-300 font-black text-xs px-3 py-1.5 rounded-full border border-emerald-500/30">
                    🟢 Activa Hoy
                  </span>
                </div>

                {/* Stats Grid for Waitress */}
                <div className="grid grid-cols-3 gap-2 bg-[#242426] p-3 rounded-2xl border border-white/10 text-center text-xs">
                  <div>
                    <span className="text-neutral-400 font-bold block text-[10px]">Mesas Atendidas:</span>
                    <span className="font-mono text-white font-black text-base">{w.tablesCount} mesas</span>
                  </div>

                  <div>
                    <span className="text-neutral-400 font-bold block text-[10px]">Ventas Totales:</span>
                    <span className="font-mono text-emerald-400 font-black text-base">${w.totalSales.toLocaleString()}</span>
                  </div>

                  <div>
                    <span className="text-neutral-400 font-bold block text-[10px]">Ticket Promedio:</span>
                    <span className="font-mono text-[#ffb700] font-black text-base">${w.avgTicket.toLocaleString()}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ================= TAB 3: PRODUCT SALES RANKING ================= */}
      {activeReportTab === 'products' && (
        <div className="bg-[#18181b] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="font-black text-white text-lg flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#ffb700]" />
            Ranking de Productos Más Vendidos del Mes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md">
            {visualSpentItems.map((p, idx) => (
              <div key={idx} className="bg-[#242426] border border-white/10 rounded-3xl p-4 flex flex-col justify-between shadow-lg relative">
                <span className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full bg-[#ffb700] text-black font-extrabold text-xs flex items-center justify-center shadow-md">
                  #{idx + 1}
                </span>

                <img src={p.image} alt={p.name} className="w-full h-36 object-contain my-2" />

                <div className="pt-2 border-t border-white/10 space-y-1">
                  <h4 className="font-bold text-white text-sm truncate">{p.name}</h4>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 font-bold">Unidades:</span>
                    <span className="font-mono text-[#ffb700] font-black">{p.qty} un.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
