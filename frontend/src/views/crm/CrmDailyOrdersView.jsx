import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, CheckCircle2, XCircle, Send, Bike, RefreshCw, Layers, Printer, Receipt, ChefHat, DollarSign, User, Utensils, CreditCard, Tag } from 'lucide-react';
import TicketPrintModal from '../../components/TicketPrintModal';

export default function CrmDailyOrdersView() {
  const { orders = [], handleAcceptOrder, handleRejectOrder, handleUpdateOrderStatus } = useApp() || {};
  const [activeTab, setActiveTab] = useState('Todos'); // 'Todos' | 'Pendiente' | 'Aceptado' | 'Enviado' | 'Rechazado'

  // Print Ticket State
  const [printingOrder, setPrintingOrder] = useState(null);
  const [ticketType, setTicketType] = useState(null); // 'cliente' | 'cocina' | 'delivery'

  // Filter orders by active tab
  const filteredOrders = orders.filter(o => {
    if (activeTab === 'Todos') return true;
    return o.status === activeTab;
  });

  const totalCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'Pendiente').length;
  const acceptedCount = orders.filter(o => o.status === 'Aceptado').length;
  const rejectedCount = orders.filter(o => o.status === 'Rechazado').length;
  const sentCount = orders.filter(o => o.status === 'Enviado').length;

  return (
    <div className="flex flex-col w-full gap-lg font-sans">
      
      {/* Thermal Ticket Print Modal */}
      {printingOrder && ticketType && (
        <TicketPrintModal
          order={printingOrder}
          ticketType={ticketType}
          onClose={() => { setPrintingOrder(null); setTicketType(null); }}
        />
      )}

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Pedidos del Día</h1>
            <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
              ● En vivo ({totalCount} registrados hoy)
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-bold mt-1">
            Revisa y gestiona en tiempo real los pedidos de Mostrador Express, Mesas de Salón y App Cliente.
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <button
          onClick={() => setActiveTab('Todos')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-xs font-black transition-all shrink-0 ${
            activeTab === 'Todos'
              ? 'bg-[#ffb700] text-black border-[#ffb700] shadow-md scale-105'
              : 'bg-[#242426] border-white/10 text-neutral-300 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          Todos los Pedidos
          <span className="w-5 h-5 rounded-full bg-black/20 text-xs font-black flex items-center justify-center">
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Aceptado')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-xs font-black transition-all shrink-0 ${
            activeTab === 'Aceptado'
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-md scale-105'
              : 'bg-[#242426] border-white/10 text-neutral-300 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Aceptados / En Marcha
          <span className="w-5 h-5 rounded-full bg-white/20 text-xs font-black flex items-center justify-center">
            {acceptedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Pendiente')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-xs font-black transition-all shrink-0 ${
            activeTab === 'Pendiente'
              ? 'bg-amber-500 text-black border-amber-500 shadow-md scale-105'
              : 'bg-[#242426] border-white/10 text-neutral-300 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          Pendientes
          <span className="w-5 h-5 rounded-full bg-black/20 text-xs font-black flex items-center justify-center">
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Enviado')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-xs font-black transition-all shrink-0 ${
            activeTab === 'Enviado'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
              : 'bg-[#242426] border-white/10 text-neutral-300 hover:text-white'
          }`}
        >
          <Send className="w-4 h-4" />
          Entregados / Finalizados
          <span className="w-5 h-5 rounded-full bg-white/20 text-xs font-black flex items-center justify-center">
            {sentCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Rechazado')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-xs font-black transition-all shrink-0 ${
            activeTab === 'Rechazado'
              ? 'bg-rose-500 text-white border-rose-500 shadow-md scale-105'
              : 'bg-[#242426] border-white/10 text-neutral-300 hover:text-white'
          }`}
        >
          <XCircle className="w-4 h-4" />
          Rechazados
          <span className="w-5 h-5 rounded-full bg-white/20 text-xs font-black flex items-center justify-center">
            {rejectedCount}
          </span>
        </button>
      </div>

      {/* Orders List Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#18181b] border border-white/10 rounded-3xl p-12 text-center text-neutral-400 space-y-3">
          <Receipt className="w-12 h-12 mx-auto text-neutral-500 opacity-40" />
          <h3 className="font-black text-white text-lg">No hay pedidos en la pestaña "{activeTab}"</h3>
          <p className="text-xs">Los pedidos registrados desde Mostrador Express, Mesas o la App Cliente aparecerán aquí al instante.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {filteredOrders.map(order => {
            let parsedItems = [];
            try {
              parsedItems = typeof order.itemsJson === 'string' ? JSON.parse(order.itemsJson) : (order.itemsJson || order.items || []);
            } catch (e) {
              parsedItems = [];
            }

            const statusColor = order.status === 'Aceptado'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : (order.status === 'Pendiente' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : (order.status === 'Enviado' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'));

            return (
              <div key={order.id} className="bg-[#18181b] border border-white/10 hover:border-[#ffb700]/50 rounded-3xl p-5 flex flex-col justify-between shadow-xl transition-all space-y-4">
                
                {/* Header: Code, Date & Status */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="font-mono text-xl font-black text-[#ffb700]">{order.code || `#PED-${order.id}`}</span>
                    <p className="text-[10px] text-neutral-400 font-bold">{order.date || 'Hoy'}</p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${statusColor}`}>
                    {order.status || 'Aceptado'}
                  </span>
                </div>

                {/* Info Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between bg-[#242426] p-2.5 rounded-xl border border-white/5">
                    <span className="text-neutral-400 font-bold">Cliente / Origen:</span>
                    <span className="font-extrabold text-white">{order.customerName || 'Cliente'}</span>
                  </div>

                  {order.customerPhone && (
                    <div className="flex items-center justify-between text-neutral-400 font-bold px-1">
                      <span>Contacto / Mozo:</span>
                      <span className="text-neutral-200">{order.customerPhone}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-neutral-400 font-bold px-1">
                    <span>Medio de Pago:</span>
                    <span className="text-emerald-400 font-black font-mono">{order.paymentMethod || 'Efectivo'}</span>
                  </div>
                </div>

                {/* Items Breakdown */}
                <div className="space-y-1.5 bg-[#242426] p-3 rounded-2xl border border-white/10 text-xs">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block border-b border-white/10 pb-1 mb-1">
                    Productos Solicitados ({parsedItems.length}):
                  </span>

                  <div className="space-y-2 max-h-36 overflow-y-auto hide-scrollbar">
                    {parsedItems.map((item, idx) => {
                      const extrasStr = (item.options?.extras || []).map(e => e.name).join(', ');
                      const removalsStr = (item.options?.removals || []).join(', ');
                      const notesStr = item.options?.notes ? `[Nota: ${item.options.notes}]` : '';

                      return (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white text-xs">{item.qty || item.quantity || 1}x {item.name}</span>
                            <span className="font-mono text-[#ffb700] font-black">${((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2)}</span>
                          </div>

                          {(item.options?.size || extrasStr || removalsStr || notesStr) && (
                            <div className="text-[10px] text-neutral-400 font-bold bg-[#18181b] p-1.5 rounded-lg leading-tight space-y-0.5">
                              {item.options?.size && <p className="text-[#ffb700]">• Tamaño: {item.options.size}</p>}
                              {extrasStr && <p className="text-emerald-400">• Extras: {extrasStr}</p>}
                              {removalsStr && <p className="text-rose-400">• {removalsStr}</p>}
                              {notesStr && <p className="text-sky-300">{notesStr}</p>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="font-bold text-white">TOTAL PEDIDO:</span>
                    <span className="font-mono text-emerald-400 font-black text-lg">${Number(order.total || 0).toFixed(2)}</span>
                  </div>
                </div>

                {/* Print Ticket Buttons */}
                <div className="grid grid-cols-3 gap-1 pt-1">
                  <button
                    onClick={() => { setPrintingOrder(order); setTicketType('cliente'); }}
                    className="py-1.5 bg-[#242428] hover:bg-[#323236] text-white text-[10px] font-extrabold rounded-xl border border-white/10 flex items-center justify-center gap-1"
                  >
                    <Printer className="w-3 h-3 text-[#ffb700]" />
                    Ticket
                  </button>

                  <button
                    onClick={() => { setPrintingOrder(order); setTicketType('cocina'); }}
                    className="py-1.5 bg-[#242428] hover:bg-[#323236] text-white text-[10px] font-extrabold rounded-xl border border-white/10 flex items-center justify-center gap-1"
                  >
                    <ChefHat className="w-3 h-3 text-emerald-400" />
                    Cocina
                  </button>

                  <button
                    onClick={() => { setPrintingOrder(order); setTicketType('delivery'); }}
                    className="py-1.5 bg-[#242428] hover:bg-[#323236] text-white text-[10px] font-extrabold rounded-xl border border-white/10 flex items-center justify-center gap-1"
                  >
                    <Send className="w-3 h-3 text-sky-400" />
                    Comanda
                  </button>
                </div>

                {/* Status Switcher Actions */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-white/10">
                  {order.status !== 'Aceptado' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'Aceptado')}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-colors"
                    >
                      ✓ Aceptar
                    </button>
                  )}

                  {order.status !== 'Enviado' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'Enviado')}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl transition-colors"
                    >
                      🚀 Entregar
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
