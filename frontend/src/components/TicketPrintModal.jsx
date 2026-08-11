import React from 'react';
import { Printer, X, User, Phone, MapPin, ChefHat, Bike, Receipt } from 'lucide-react';

export default function TicketPrintModal({ order, ticketType, onClose }) {
  if (!order || !ticketType) return null;

  let parsedItems = [];
  try {
    parsedItems = typeof order.itemsJson === 'string' ? JSON.parse(order.itemsJson) : (order.itemsJson || []);
  } catch (e) {
    parsedItems = [];
  }

  const handlePrint = () => {
    window.print();
  };

  const getTitle = () => {
    if (ticketType === 'cocina') return '👨‍🍳 Ticket para Cocina';
    if (ticketType === 'delivery') return '🛵 Ticket para Delivery';
    return '📄 Ticket para Cliente';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
      
      {/* On-screen Modal Window (Hidden during printing via print:hidden) */}
      <div className="relative w-full max-w-md bg-[#18181b] border border-white/10 rounded-3xl p-6 flex flex-col gap-5 shadow-2xl text-white my-6 print:hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#ffb700]" />
            <h3 className="text-lg font-black text-white">{getTitle()}</h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#242426] border border-white/10 flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Ticket Options Switcher */}
        <div className="grid grid-cols-3 gap-2 bg-[#242426] p-1.5 rounded-2xl border border-white/10 text-xs">
          <button
            onClick={() => {}}
            className={`py-2 px-1 text-center rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
              ticketType === 'cliente' ? 'bg-[#ffb700] text-black font-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Cliente</span>
          </button>

          <button
            onClick={() => {}}
            className={`py-2 px-1 text-center rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
              ticketType === 'cocina' ? 'bg-[#ffb700] text-black font-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Cocina</span>
          </button>

          <button
            onClick={() => {}}
            className={`py-2 px-1 text-center rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
              ticketType === 'delivery' ? 'bg-[#ffb700] text-black font-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Delivery</span>
          </button>
        </div>

        {/* Thermal Ticket Preview Box */}
        <div className="bg-white text-black p-4 rounded-2xl shadow-inner font-mono text-xs overflow-y-auto max-h-[50vh] leading-tight border border-neutral-300">
          
          {/* ================= TICKET CONTENT (TARGET FOR THERMAL PRINTER) ================= */}
          <div id="thermal-ticket-content" className="w-full text-black bg-white font-mono text-xs">
            
            {/* 1. TICKET COCINA */}
            {ticketType === 'cocina' && (
              <div className="space-y-2">
                <div className="text-center border-b-2 border-black pb-2">
                  <p className="font-black text-base uppercase">*** COCINA ***</p>
                  <p className="text-sm font-bold mt-1">CÓDIGO: {order.code}</p>
                  <p className="text-[11px]">HORA: {order.date || new Date().toLocaleTimeString()}</p>
                  <p className="text-[11px] font-bold mt-0.5">TIPO: {order.fulfillmentType ? order.fulfillmentType.toUpperCase() : 'DELIVERY'}</p>
                </div>

                <div className="py-2 border-b border-dashed border-black">
                  <p className="font-bold uppercase text-[11px] mb-1">CLIENTE: {order.customerName}</p>
                  {order.address && <p className="text-[10px]">UBICACIÓN: {order.address}</p>}
                </div>

                <div className="py-2 space-y-3">
                  <p className="font-black text-center underline uppercase">PRODUCTOS A PREPARAR</p>
                  {parsedItems.map((item, i) => (
                    <div key={i} className="border-b border-gray-300 pb-2">
                      <p className="font-black text-sm">
                        [ ] {item.qty || item.quantity || 1}x {item.name}
                      </p>
                      {item.options && (
                        <div className="pl-4 font-bold text-xs space-y-0.5 text-black">
                          {item.options.size && <p>• Tamaño: {item.options.size}</p>}
                          {item.options.addCheese && <p>• EXTRA: Queso Cheddar</p>}
                          {item.options.extraPatty && <p>• EXTRA: Medallón de Carne</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-center border-t-2 border-black pt-2 text-[10px]">
                  <p>EMISIÓN: {new Date().toLocaleString()}</p>
                  <p className="font-bold">*** CRASH BURGERS COCINA ***</p>
                </div>
              </div>
            )}

            {/* 2. TICKET DELIVERY */}
            {ticketType === 'delivery' && (
              <div className="space-y-2">
                <div className="text-center border-b-2 border-black pb-2">
                  <p className="font-black text-base uppercase">*** REPARTIDOR / DELIVERY ***</p>
                  <p className="text-sm font-bold mt-1">CÓDIGO: {order.code}</p>
                </div>

                <div className="py-2 border-b border-dashed border-black space-y-1">
                  <p className="font-bold">CLIENTE: {order.customerName}</p>
                  <p className="font-bold">TELÉFONO: {order.customerPhone || '+54 9 --'}</p>
                </div>

                {/* Detailed Delivery Address Breakdown */}
                <div className="py-2 border-b-2 border-black space-y-1 bg-gray-100 p-2 rounded">
                  <p className="font-black text-center underline uppercase">DIRECCIÓN DE ENTREGA</p>
                  <p className="font-bold text-xs">DIRECCIÓN: {order.address || 'Delivery sin dirección registrada'}</p>
                </div>

                <div className="py-2 space-y-2 border-b border-dashed border-black">
                  <p className="font-black underline uppercase text-[11px]">ITEMS EN EL PAQUETE</p>
                  {parsedItems.map((item, i) => (
                    <div key={i} className="flex justify-between font-bold text-xs">
                      <span>• {item.qty || item.quantity || 1}x {item.name}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-2 space-y-1">
                  <p className="font-black text-sm uppercase">MONTO A COBRAR EN DESTINO:</p>
                  <p className="font-black text-lg text-black">$ {Number(order.total).toFixed(2)}</p>
                  <p className="text-[10px] mt-2 font-bold">*** ENTREGAR COMPLETO AL CLIENTE ***</p>
                </div>
              </div>
            )}

            {/* 3. TICKET CLIENTE */}
            {ticketType === 'cliente' && (
              <div className="space-y-2">
                <div className="text-center border-b-2 border-black pb-2">
                  <p className="font-black text-base tracking-wider uppercase">CRASH BURGERS 🍔</p>
                  <p className="text-[10px]">¡Buena Comida, Buen Humor!</p>
                  <p className="text-[11px] font-bold mt-1">COMPROBANTE CLIENTE</p>
                  <p className="text-[10px]">FECHA: {order.date || new Date().toLocaleString()}</p>
                  <p className="text-xs font-bold">CÓDIGO: {order.code}</p>
                </div>

                <div className="py-1 border-b border-dashed border-black text-[11px]">
                  <p><strong>CLIENTE:</strong> {order.customerName}</p>
                  <p><strong>TEL:</strong> {order.customerPhone || '+54 9 --'}</p>
                </div>

                <div className="py-2 space-y-1.5 border-b border-dashed border-black">
                  <p className="font-bold text-center underline uppercase text-[11px]">DETALLE DE COMPRA</p>
                  {parsedItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-start text-[11px]">
                      <span>{item.qty || item.quantity || 1}x {item.name}</span>
                      <span className="font-bold">${((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 space-y-1 text-right font-bold text-xs">
                  <div className="flex justify-between text-sm font-black border-t border-black pt-1">
                    <span>TOTAL A PAGAR:</span>
                    <span>$ {Number(order.total).toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-center border-t-2 border-black pt-3 mt-2 text-[10px]">
                  <p className="font-bold">¡MUCHAS GRACIAS POR TU COMPRA!</p>
                  <p>www.crashburgers.com</p>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Action Button: Print Ticket */}
        <button
          onClick={handlePrint}
          className="w-full py-3.5 rounded-full bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <Printer className="w-5 h-5" />
          IMPRIMIR TICKET TÉRMICO (58mm/80mm)
        </button>

      </div>
    </div>
  );
}
