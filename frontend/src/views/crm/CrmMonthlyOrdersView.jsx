import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function CrmMonthlyOrdersView() {
  const { orders, handleUpdateOrderStatus } = useApp();
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'Todos' || order.status === filter;
    const matchesSearch = order.code.toLowerCase().includes(search.toLowerCase()) ||
                          order.customerName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full gap-xl relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md mt-md">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">Pedidos Mensuales</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs flex items-center gap-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Monitoreo en vivo de pedidos del mes
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <button className="bg-surface-container-high text-on-surface px-lg py-sm rounded-full font-label-bold text-label-bold hover:bg-surface-container-highest transition-colors shadow-sm flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Exportar
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="bg-surface-container-low/60 rounded-2xl p-lg relative overflow-hidden shadow-md">
          <div className="flex justify-between items-start mb-lg relative z-10">
            <div className="p-sm bg-surface-container-highest rounded-lg text-primary">
              <span className="material-symbols-outlined">receipt_long</span>
            </div>
            <span className="font-label-bold text-label-bold text-on-surface-variant flex items-center gap-xs bg-surface-container/50 px-sm py-xs rounded-full">
              <span className="material-symbols-outlined text-[14px] text-tertiary">arrow_upward</span> 12%
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-headline-lg text-headline-lg text-on-surface">{orders.length}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider mt-xs">Total Pedidos</p>
          </div>
        </div>

        <div className="bg-surface-container-low/60 rounded-2xl p-lg relative overflow-hidden shadow-md">
          <div className="flex justify-between items-start mb-lg relative z-10">
            <div className="p-sm bg-surface-container-highest rounded-lg text-tertiary-container">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
            <span className="font-label-bold text-label-bold text-on-surface-variant flex items-center gap-xs bg-surface-container/50 px-sm py-xs rounded-full">
              <span className="material-symbols-outlined text-[14px] text-error">arrow_downward</span> 4%
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-headline-lg text-headline-lg text-on-surface">
              {orders.filter(o => o.status === 'Pendiente').length}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider mt-xs">Pendientes de Aceptación</p>
          </div>
        </div>

        <div className="bg-surface-container-low/60 rounded-2xl p-lg relative overflow-hidden shadow-md">
          <div className="flex justify-between items-start mb-lg relative z-10">
            <div className="p-sm bg-surface-container-highest rounded-lg text-secondary">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="font-label-bold text-label-bold text-on-surface-variant flex items-center gap-xs bg-surface-container/50 px-sm py-xs rounded-full">
              <span className="material-symbols-outlined text-[14px] text-tertiary">arrow_upward</span> 8%
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-headline-lg text-headline-lg text-on-surface">
              ${orders.reduce((sum, o) => sum + Number(o.total || 0), 0).toFixed(2)}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider mt-xs">Recaudación Total</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-md bg-surface-container-low/60 p-md rounded-2xl shadow-sm z-20">
        <div className="flex items-center gap-sm overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
          {['Todos', 'Pendiente', 'En Proceso', 'Enviado'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-lg py-sm rounded-full font-label-bold text-label-bold transition-colors ${
                filter === f
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container-high/50 text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {f === 'Todos' ? 'Todos los Pedidos' : f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            placeholder="Filtrar por ID o Nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-highest/30 rounded-full py-sm pl-xl pr-md text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-highest/60 transition-colors"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-low/50 rounded-3xl shadow-xl overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/40 text-on-surface-variant font-label-bold text-label-bold uppercase tracking-widest text-[10px]">
                <th className="py-md px-lg font-medium">ID Pedido</th>
                <th className="py-md px-lg font-medium">Cliente</th>
                <th className="py-md px-lg font-medium">Fecha y Hora</th>
                <th className="py-md px-lg font-medium">Total</th>
                <th className="py-md px-lg font-medium">Estado</th>
                <th className="py-md px-lg font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-body-sm font-body-sm text-on-surface">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-highest/30 transition-colors group">
                  <td className="py-md px-lg font-mono text-primary">{order.code}</td>
                  <td className="py-md px-lg">
                    <div className="flex items-center gap-sm">
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden flex items-center justify-center">
                        {order.customerAvatar ? (
                          <img src={order.customerAvatar} alt={order.customerName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-xs">person</span>
                        )}
                      </div>
                      <div>
                        <div className="font-title-md text-title-md text-on-surface">{order.customerName}</div>
                        <div className="text-[10px] text-on-surface-variant">{order.itemsSummary}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-md px-lg text-on-surface-variant">{order.date}</td>
                  <td className="py-md px-lg font-price-display text-price-display text-on-surface">${order.total}</td>
                  <td className="py-md px-lg">
                    <span className={`inline-flex items-center gap-xs px-sm py-[2px] rounded-full text-label-bold font-label-bold ${
                      order.status === 'Pendiente' ? 'bg-tertiary/10 text-tertiary-fixed' :
                      order.status === 'En Proceso' ? 'bg-secondary/10 text-secondary-fixed' : 'bg-surface-container-highest text-on-surface-variant'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-md px-lg text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex justify-end gap-xs">
                      {order.status === 'Pendiente' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'En Proceso')}
                          className="p-sm bg-primary/20 text-primary rounded-lg hover:bg-primary hover:text-on-primary transition-colors"
                          title="Aceptar Pedido"
                        >
                          <span className="material-symbols-outlined text-[18px]">check</span>
                        </button>
                      )}
                      {order.status === 'En Proceso' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'Enviado')}
                          className="p-sm bg-surface-container-highest text-on-surface-variant rounded-lg hover:text-on-surface hover:bg-surface-container-highest/80 transition-colors"
                          title="Marcar como Enviado"
                        >
                          <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                        </button>
                      )}
                      <button
                        className="p-sm bg-surface-container-highest text-on-surface-variant rounded-lg hover:text-on-surface transition-colors"
                        title="Ver Detalle"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
