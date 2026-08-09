import React from 'react';
import { useApp } from '../../context/AppContext';

export default function CrmDashboardView() {
  const { orders, setCrmTab } = useApp();

  const totalOrders = orders.length > 0 ? orders.length : 2450;
  const revenue = orders.length > 0 ? orders.reduce((sum, o) => sum + Number(o.total || 0), 0) : 15840;

  return (
    <div className="flex flex-col w-full gap-xl">
      {/* Tarjetas Bento de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        
        {/* Total de Pedidos */}
        <div className="relative overflow-hidden rounded-[24px] bg-surface-container-low/60 border border-white/5 p-lg shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex justify-between items-start mb-xl relative z-10">
            <div className="w-12 h-12 rounded-[16px] bg-surface-container-high flex items-center justify-center border border-white/5">
              <span className="material-symbols-outlined text-primary text-[24px]">receipt_long</span>
            </div>
            <div className="px-sm py-xs rounded-full bg-primary/10 text-primary text-label-bold font-label-bold flex items-center gap-xs">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +12%
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-on-surface-variant text-body-sm font-body-sm mb-xs">Pedidos Totales</p>
            <div className="flex items-baseline gap-sm">
              <h2 className="text-headline-xl font-headline-xl text-on-surface tracking-tight">{totalOrders}</h2>
            </div>
          </div>
        </div>

        {/* Ingresos */}
        <div className="relative overflow-hidden rounded-[24px] bg-surface-container-low/60 border border-white/5 p-lg shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex justify-between items-start mb-xl relative z-10">
            <div className="w-12 h-12 rounded-[16px] bg-surface-container-high flex items-center justify-center border border-white/5">
              <span className="material-symbols-outlined text-primary-container text-[24px]">payments</span>
            </div>
            <div className="px-sm py-xs rounded-full bg-primary/10 text-primary text-label-bold font-label-bold flex items-center gap-xs">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +8.5%
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-on-surface-variant text-body-sm font-body-sm mb-xs">Ingresos Recaudados</p>
            <div className="flex items-baseline gap-sm">
              <h2 className="text-headline-xl font-headline-xl text-on-surface tracking-tight">
                ${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
          </div>
        </div>

        {/* Promedio de Entrega */}
        <div className="relative overflow-hidden rounded-[24px] bg-surface-container-low/60 border border-white/5 p-lg shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex justify-between items-start mb-xl relative z-10">
            <div className="w-12 h-12 rounded-[16px] bg-surface-container-high flex items-center justify-center border border-white/5">
              <span className="material-symbols-outlined text-secondary text-[24px]">timer</span>
            </div>
            <div className="px-sm py-xs rounded-full bg-secondary-container text-on-secondary-container text-label-bold font-label-bold flex items-center gap-xs">
              <span className="material-symbols-outlined text-[14px]">trending_down</span>
              -2 min
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-on-surface-variant text-body-sm font-body-sm mb-xs">Tiempo Promedio Entrega</p>
            <div className="flex items-baseline gap-sm">
              <h2 className="text-headline-xl font-headline-xl text-on-surface tracking-tight">
                24 <span className="text-headline-lg font-headline-lg text-on-surface-variant">min</span>
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* Grid para Gráfico e Historial Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        
        {/* Gráfico de Tendencias Mensuales */}
        <div className="lg:col-span-2 rounded-[24px] bg-surface-container-lowest/50 border border-white/5 p-lg shadow-lg relative overflow-hidden flex flex-col min-h-[400px]">
          <div className="relative z-10 flex justify-between items-center mb-xl">
            <div>
              <h3 className="text-headline-lg font-headline-lg text-on-surface">Tendencias Mensuales</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-xs">Pedidos vs Ingresos en los últimos 30 días</p>
            </div>
            <button className="px-md py-sm rounded-full bg-surface-container-high hover:bg-surface-bright transition-colors border border-white/10 flex items-center gap-sm text-body-sm font-body-sm text-on-surface">
              Este Mes <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>
          </div>

          <div className="flex-1 relative w-full h-full min-h-[250px] mt-md">
            <svg className="w-full h-full absolute inset-0 overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
              <g className="text-white/5" stroke="currentColor" strokeDasharray="4,4" strokeWidth="1">
                <line x1="0" y1="50" x2="800" y2="50"></line>
                <line x1="0" y1="100" x2="800" y2="100"></line>
                <line x1="0" y1="150" x2="800" y2="150"></line>
              </g>
              <path d="M0,200 L0,140 C100,140 150,80 250,90 C350,100 400,160 500,140 C600,120 650,40 800,60 L800,200 Z" fill="rgba(255,183,127,0.1)"></path>
              <path d="M0,140 C100,140 150,80 250,90 C350,100 400,160 500,140 C600,120 650,40 800,60" fill="none" stroke="#ffb77f" strokeWidth="3" style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}></path>
              <circle cx="250" cy="90" r="4" fill="#131313" stroke="#ffb77f" strokeWidth="2"></circle>
              <circle cx="500" cy="140" r="4" fill="#131313" stroke="#ffb77f" strokeWidth="2"></circle>
              <circle cx="800" cy="60" r="4" fill="#131313" stroke="#ffb77f" strokeWidth="2"></circle>
            </svg>
          </div>

          <div className="relative z-10 flex justify-between text-body-sm font-body-sm text-on-surface-variant/50 px-md mt-sm">
            <span>Semana 1</span>
            <span>Semana 2</span>
            <span>Semana 3</span>
            <span>Semana 4</span>
          </div>
        </div>

        {/* Lista de Pedidos Recientes */}
        <div className="rounded-[24px] bg-surface-container-lowest/50 border border-white/5 p-0 shadow-lg relative overflow-hidden flex flex-col">
          <div className="p-lg border-b border-white/5 flex justify-between items-center bg-surface-container-low/20">
            <h3 className="text-title-md font-title-md text-on-surface">Pedidos Recientes</h3>
            <button className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">more_horiz</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col">
              {orders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex items-center gap-md p-md hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0 group">
                  <div className="w-12 h-12 rounded-[12px] overflow-hidden relative shrink-0 border border-white/10 bg-surface-container flex items-center justify-center">
                    {order.customerAvatar ? (
                      <img src={order.customerAvatar} alt={order.customerName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-on-surface-variant">fastfood</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-xs">
                      <h4 className="text-body-lg font-body-lg text-on-surface truncate">{order.code}</h4>
                      <span className="text-price-display font-price-display text-primary">${order.total}</span>
                    </div>
                    <div className="flex items-center gap-sm text-body-sm font-body-sm text-on-surface-variant">
                      <span className={`w-2 h-2 rounded-full ${order.status === 'Pendiente' ? 'bg-primary' : 'bg-tertiary'}`}></span>
                      {order.status}
                      <span className="text-white/20">•</span>
                      {order.date}
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-md pt-sm flex justify-center">
                <button
                  onClick={() => setCrmTab('monthly-orders')}
                  className="text-primary text-label-bold font-label-bold uppercase tracking-wider hover:text-primary-fixed transition-colors"
                >
                  Ver Todos los Pedidos
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
