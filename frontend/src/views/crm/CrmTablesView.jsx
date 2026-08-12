import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Users, Clock, ShoppingBag, CheckCircle2, Trash2, Printer, Edit, X, Search, Sparkles, ChefHat, DollarSign, CreditCard, QrCode, Zap, User, MessageSquare, Utensils, Settings, Check } from 'lucide-react';
import TicketPrintModal from '../../components/TicketPrintModal';

const AVAILABLE_EXTRAS = [
  { id: 'addCheese', name: '+ Queso Cheddar Extra', price: 1.20, icon: '🧀' },
  { id: 'extraPatty', name: '+ Medallón de Carne Extra 120g', price: 2.50, icon: '🥩' },
  { id: 'addBacon', name: '+ Panceta / Bacon Crispy', price: 1.80, icon: '🥓' },
  { id: 'caramelizedOnion', name: '+ Cebolla Caramelizada', price: 0.90, icon: '🧅' },
  { id: 'friedEgg', name: '+ Huevo Frito', price: 1.00, icon: '🍳' },
  { id: 'extraSauce', name: '+ Salsa Especial CRASH', price: 0.80, icon: '🌶️' },
  { id: 'extraFries', name: '+ Papas Fritas Extra', price: 2.00, icon: '🍟' },
];

const AVAILABLE_REMOVALS = [
  'Sin Pepinillos',
  'Sin Cebolla',
  'Sin Tomate',
  'Sin Salsa Especial',
];

const DEFAULT_INITIAL_TABLES = [
  // Planta Baja
  { id: 1, name: 'Mesa 1', floor: 'Planta Baja', capacity: 4, status: 'libre', activeOrder: null },
  { id: 2, name: 'Mesa 2', floor: 'Planta Baja', capacity: 2, status: 'libre', activeOrder: null },
  { id: 3, name: 'Mesa 3', floor: 'Planta Baja', capacity: 4, status: 'libre', activeOrder: null },
  { id: 4, name: 'Mesa 4', floor: 'Planta Baja', capacity: 6, status: 'libre', activeOrder: null },
  { id: 5, name: 'Mesa 5', floor: 'Planta Baja', capacity: 4, status: 'libre', activeOrder: null },
  { id: 6, name: 'Barra 1', floor: 'Planta Baja', capacity: 2, status: 'libre', activeOrder: null },

  // Planta Alta
  { id: 101, name: 'Mesa Alta 1', floor: 'Planta Alta', capacity: 4, status: 'libre', activeOrder: null },
  { id: 102, name: 'Mesa Alta 2', floor: 'Planta Alta', capacity: 4, status: 'libre', activeOrder: null },
  { id: 103, name: 'Mesa Alta 3', floor: 'Planta Alta', capacity: 6, status: 'libre', activeOrder: null },
  { id: 104, name: 'VIP Terraza', floor: 'Planta Alta', capacity: 8, status: 'libre', activeOrder: null },
];

export default function CrmTablesView() {
  const context = useApp() || {};
  const products = Array.isArray(context.products) ? context.products : [];
  const categories = Array.isArray(context.categories) ? context.categories : [];
  const placeOrder = typeof context.placeOrder === 'function' ? context.placeOrder : () => {};
  const showToast = typeof context.showToast === 'function' ? context.showToast : () => {};

  // Floor Zone Tab: 'Planta Baja' | 'Planta Alta'
  const [activeFloor, setActiveFloor] = useState('Planta Baja');

  // Persistent Tables State from LocalStorage
  const [tables, setTables] = useState(() => {
    try {
      const saved = localStorage.getItem('crm_tables_persistent_v2');
      return saved ? JSON.parse(saved) : DEFAULT_INITIAL_TABLES;
    } catch (e) {
      return DEFAULT_INITIAL_TABLES;
    }
  });

  // Save Tables state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('crm_tables_persistent_v2', JSON.stringify(tables));
    } catch (e) {
      console.error('Error guardando mesas:', e);
    }
  }, [tables]);

  // Selected Table Modal State
  const [selectedTable, setSelectedTable] = useState(null);

  // New Table Modal State
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState('4');

  // Order Taking State for Selected Table
  const [waiterName, setWaiterName] = useState('Sofía R.');
  const [dinersCount, setDinersCount] = useState('2');
  const [notes, setNotes] = useState('');
  const [tableCart, setTableCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Todas');

  // Customization Extras Modal State for Table Cart Item
  const [editingCartIndex, setEditingCartIndex] = useState(null);

  // Thermal Ticket State
  const [printingOrder, setPrintingOrder] = useState(null);
  const [ticketType, setTicketType] = useState(null);

  // Tables on current active floor
  const floorTables = tables.filter(t => t.floor === activeFloor);

  // Quick stats
  const freeCount = floorTables.filter(t => t.status === 'libre').length;
  const occupiedCount = floorTables.filter(t => t.status === 'ocupada').length;

  // Add a new Table
  const handleAddNewTable = (e) => {
    e.preventDefault();
    if (!newTableName.trim()) {
      showToast('⚠️ Ingresa el nombre o número de la mesa');
      return;
    }

    const newId = Date.now();
    const newT = {
      id: newId,
      name: newTableName.trim(),
      floor: activeFloor,
      capacity: parseInt(newTableCapacity) || 4,
      status: 'libre',
      activeOrder: null
    };

    setTables(prev => [...prev, newT]);
    showToast(`✅ ${newTableName} agregada a ${activeFloor}`);
    setNewTableName('');
    setIsAddTableOpen(false);
  };

  // Open Table Modal for Order Taking or Managing
  const handleOpenTableModal = (table) => {
    setSelectedTable(table);
    if (table.activeOrder) {
      setTableCart(table.activeOrder.items || []);
      setWaiterName(table.activeOrder.waiter || 'Sofía R.');
      setDinersCount(table.activeOrder.diners || '2');
      setNotes(table.activeOrder.notes || '');
      setPaymentMethod(table.activeOrder.paymentMethod || 'Efectivo');
    } else {
      setTableCart([]);
      setNotes('');
    }
  };

  // Add Product to Table Cart (with default options)
  const addToTableCart = (product, customize = false) => {
    const newItem = {
      id: product.id,
      name: product.name,
      basePrice: Number(product.price || 0),
      price: Number(product.price || 0),
      quantity: 1,
      image: product.image,
      options: {
        size: 'Doble',
        extras: [],
        removals: [],
        notes: ''
      }
    };

    setTableCart(prev => {
      const updated = [...prev, newItem];
      if (customize) {
        setEditingCartIndex(updated.length - 1);
      }
      return updated;
    });

    showToast(`🍔 "${product.name}" añadido al pedido`);
  };

  const updateTableItemQty = (index, delta) => {
    setTableCart(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) return updated.filter((_, i) => i !== index);
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const removeFromTableCart = (index) => {
    setTableCart(prev => prev.filter((_, i) => i !== index));
  };

  // Customization Handlers for item in editingCartIndex
  const toggleExtraInItem = (extraObj) => {
    if (editingCartIndex === null || !tableCart[editingCartIndex]) return;

    setTableCart(prev => {
      const updated = [...prev];
      const item = { ...updated[editingCartIndex] };
      const currentExtras = item.options.extras || [];

      const exists = currentExtras.some(e => e.id === extraObj.id);
      let newExtras = [];
      if (exists) {
        newExtras = currentExtras.filter(e => e.id !== extraObj.id);
      } else {
        newExtras = [...currentExtras, extraObj];
      }

      let sizeExtra = 0;
      if (item.options.size === 'Triple') sizeExtra = 2.00;

      const extrasSum = newExtras.reduce((sum, e) => sum + e.price, 0);
      item.options = { ...item.options, extras: newExtras };
      item.price = item.basePrice + extrasSum + sizeExtra;
      updated[editingCartIndex] = item;
      return updated;
    });
  };

  const toggleRemovalInItem = (removalName) => {
    if (editingCartIndex === null || !tableCart[editingCartIndex]) return;

    setTableCart(prev => {
      const updated = [...prev];
      const item = { ...updated[editingCartIndex] };
      const currentRemovals = item.options.removals || [];

      const exists = currentRemovals.includes(removalName);
      let newRemovals = [];
      if (exists) {
        newRemovals = currentRemovals.filter(r => r !== removalName);
      } else {
        newRemovals = [...currentRemovals, removalName];
      }

      item.options = { ...item.options, removals: newRemovals };
      updated[editingCartIndex] = item;
      return updated;
    });
  };

  const setSizeInItem = (sizeName) => {
    if (editingCartIndex === null || !tableCart[editingCartIndex]) return;

    setTableCart(prev => {
      const updated = [...prev];
      const item = { ...updated[editingCartIndex] };
      
      let sizeExtra = 0;
      if (sizeName === 'Triple') sizeExtra = 2.00;

      const extrasSum = (item.options.extras || []).reduce((sum, e) => sum + e.price, 0);
      item.options = { ...item.options, size: sizeName };
      item.price = item.basePrice + extrasSum + sizeExtra;
      updated[editingCartIndex] = item;
      return updated;
    });
  };

  const setNotesInItem = (notesText) => {
    if (editingCartIndex === null || !tableCart[editingCartIndex]) return;

    setTableCart(prev => {
      const updated = [...prev];
      const item = { ...updated[editingCartIndex] };
      item.options = { ...item.options, notes: notesText };
      updated[editingCartIndex] = item;
      return updated;
    });
  };

  // Subtotal Calculation
  const cartSubtotal = tableCart.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

  // Confirm Order / Open Table
  const handleConfirmTableOrder = (sendToKitchen = false) => {
    if (!selectedTable) return;
    if (tableCart.length === 0) {
      showToast('⚠️ Agrega productos al pedido de la mesa');
      return;
    }

    const orderCode = selectedTable.activeOrder?.code || `#MESA-${Math.floor(1000 + Math.random() * 9000)}`;
    const openTime = selectedTable.activeOrder?.openTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedOrder = {
      code: orderCode,
      openTime,
      waiter: waiterName.trim() || 'Sofía R.',
      diners: dinersCount,
      notes: notes.trim(),
      items: tableCart,
      total: cartSubtotal,
      paymentMethod
    };

    // Update Table state to OCUPADA
    setTables(prev => prev.map(t => {
      if (t.id === selectedTable.id) {
        return {
          ...t,
          status: 'ocupada',
          activeOrder: updatedOrder
        };
      }
      return t;
    }));

    showToast(`🍽️ ${selectedTable.name} abierta con ${tableCart.length} productos por ${waiterName}`);

    if (sendToKitchen) {
      const kitchenOrder = {
        code: orderCode,
        customerName: `${selectedTable.name} (${activeFloor})`,
        customerPhone: `Atendido por: ${waiterName}`,
        waiter: waiterName,
        fulfillmentType: 'dinein',
        address: `${selectedTable.name} - ${activeFloor}`,
        itemsJson: JSON.stringify(tableCart),
        total: cartSubtotal,
        date: new Date().toLocaleString()
      };

      setPrintingOrder(kitchenOrder);
      setTicketType('cocina');
    }

    setSelectedTable(null);
  };

  // Close & Pay Table (Liberar Mesa)
  const handleCloseAndPayTable = () => {
    if (!selectedTable || !selectedTable.activeOrder) return;

    const orderCode = selectedTable.activeOrder.code;
    const finalTotal = selectedTable.activeOrder.total;
    const assignedWaiter = selectedTable.activeOrder.waiter || waiterName || 'Sofía R.';

    // Create record in CRM orders
    const crmOrder = {
      id: Date.now(),
      code: orderCode,
      customerName: `${selectedTable.name} (${activeFloor})`,
      customerPhone: `Atendido por: ${assignedWaiter}`,
      waiter: assignedWaiter,
      fulfillmentType: 'dinein',
      address: `${selectedTable.name} - ${activeFloor}`,
      paymentMethod,
      itemsSummary: selectedTable.activeOrder.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
      itemsJson: JSON.stringify(selectedTable.activeOrder.items),
      total: finalTotal,
      date: new Date().toLocaleString(),
      status: 'Aceptado'
    };

    placeOrder(crmOrder);

    // Free up table state to LIBRE
    setTables(prev => prev.map(t => {
      if (t.id === selectedTable.id) {
        return { ...t, status: 'libre', activeOrder: null };
      }
      return t;
    }));

    showToast(`⚡ ${selectedTable.name} cobrada ($${finalTotal.toFixed(2)}) por ${assignedWaiter} y liberada 🟢`);

    // Open Thermal Ticket Modal
    setPrintingOrder(crmOrder);
    setTicketType('cliente');
    setSelectedTable(null);
  };

  // Filter Catalog Products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCat === 'Todas' || p.category === selectedCat;
    const matchesSearch = (p.name || '').toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full gap-lg font-sans">
      
      {/* Thermal Ticket Printer Modal */}
      {printingOrder && (
        <TicketPrintModal
          order={printingOrder}
          ticketType={ticketType}
          onClose={() => {
            setPrintingOrder(null);
            setTicketType(null);
          }}
        />
      )}

      {/* ================= MODAL: PERSONALIZACIÓN & EXTRAS ================= */}
      {editingCartIndex !== null && tableCart[editingCartIndex] && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#18181b] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto hide-scrollbar">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#ffb700]" />
                <div>
                  <h3 className="font-black text-white text-base">Aditivos y Extras: {tableCart[editingCartIndex].name}</h3>
                  <p className="text-xs text-neutral-400 font-bold">Personaliza medallones, queso, aditivos y notas para la comanda</p>
                </div>
              </div>
              <button onClick={() => setEditingCartIndex(null)} className="w-8 h-8 rounded-full bg-[#242426] flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="font-bold text-xs text-neutral-300 block">Tamaño de la Hamburguesa:</label>
              <div className="grid grid-cols-3 gap-2">
                {['Sencilla', 'Doble', 'Triple'].map(sz => {
                  const isSelected = (tableCart[editingCartIndex].options?.size || 'Doble') === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSizeInItem(sz)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        isSelected ? 'bg-[#ffb700] text-black border-[#ffb700] font-black' : 'bg-[#242426] text-white border-white/10 hover:border-white/20'
                      }`}
                    >
                      {sz} {sz === 'Triple' ? '(+$2.00)' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Extras Selection */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="font-bold text-xs text-neutral-300 block">Aditivos y Extras Adicionales (Pagos):</label>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_EXTRAS.map(extra => {
                  const isChecked = (tableCart[editingCartIndex].options?.extras || []).some(e => e.id === extra.id);
                  return (
                    <button
                      key={extra.id}
                      onClick={() => toggleExtraInItem(extra)}
                      className={`p-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-between transition-all border ${
                        isChecked ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-[#242426] border-white/10 text-neutral-300 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{extra.icon}</span>
                        <span className="truncate">{extra.name}</span>
                      </span>
                      <span className="font-mono text-[#ffb700] shrink-0 ml-1">+${extra.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Removals Selection */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="font-bold text-xs text-neutral-300 block">Quitar o Remociones (Sin costo):</label>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_REMOVALS.map(rem => {
                  const isChecked = (tableCart[editingCartIndex].options?.removals || []).includes(rem);
                  return (
                    <button
                      key={rem}
                      onClick={() => toggleRemovalInItem(rem)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all border ${
                        isChecked ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-[#242426] border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {rem}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kitchen Notes */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="font-bold text-xs text-neutral-300 block">Nota Especial para Cocina:</label>
              <input
                type="text"
                placeholder="Ej. Término medio, cebolla bien dorada, etc..."
                value={tableCart[editingCartIndex].options?.notes || ''}
                onChange={(e) => setNotesInItem(e.target.value)}
                className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#ffb700]"
              />
            </div>

            <button
              onClick={() => setEditingCartIndex(null)}
              className="w-full py-3.5 rounded-2xl bg-[#ffb700] text-black font-black text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors shadow-lg"
            >
              ✓ GUARDAR PERSONALIZACIÓN DE ITEM
            </button>
          </div>
        </div>
      )}

      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Gestión de Mesas y Salón</h1>
          <p className="text-xs text-neutral-400 font-bold">Control en tiempo real de mesas en Planta Baja y Planta Alta con personalización de pedidos</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Floor Zone Tabs */}
          <div className="flex items-center bg-[#242426] p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveFloor('Planta Baja')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeFloor === 'Planta Baja' ? 'bg-[#ffb700] text-black font-black shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              🏬 Planta Baja ({tables.filter(t => t.floor === 'Planta Baja').length})
            </button>
            <button
              onClick={() => setActiveFloor('Planta Alta')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeFloor === 'Planta Alta' ? 'bg-[#ffb700] text-black font-black shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              🏙️ Planta Alta ({tables.filter(t => t.floor === 'Planta Alta').length})
            </button>
          </div>

          <button
            onClick={() => setIsAddTableOpen(true)}
            className="px-4 py-2 rounded-2xl bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 text-black stroke-[3]" />
            + Mesa
          </button>
        </div>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-md">
        <div className="bg-[#18181b] border border-white/10 p-4 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <p className="text-xs text-neutral-400 font-bold">Mesas en {activeFloor}</p>
            <p className="text-2xl font-black text-white font-mono">{floorTables.length}</p>
          </div>
          <Utensils className="w-8 h-8 text-neutral-500/40" />
        </div>

        <div className="bg-[#18181b] border border-emerald-500/30 p-4 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <p className="text-xs text-emerald-400 font-bold">Mesas Libres 🟢</p>
            <p className="text-2xl font-black text-emerald-300 font-mono">{freeCount}</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
        </div>

        <div className="bg-[#18181b] border border-rose-500/30 p-4 rounded-3xl flex items-center justify-between shadow-xl col-span-2 sm:col-span-1">
          <div>
            <p className="text-xs text-rose-400 font-bold">Mesas Ocupadas 🔴</p>
            <p className="text-2xl font-black text-rose-300 font-mono">{occupiedCount}</p>
          </div>
          <Clock className="w-8 h-8 text-rose-500/50" />
        </div>
      </div>

      {/* ================= TABLES GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg">
        {floorTables.map(table => {
          const isFree = table.status === 'libre';

          return (
            <div
              key={table.id}
              className={`bg-[#18181b] border rounded-3xl p-5 flex flex-col justify-between shadow-xl transition-all ${
                isFree ? 'border-emerald-500/30 hover:border-emerald-500' : 'border-rose-500/50 hover:border-rose-500'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-white text-lg">{table.name}</h3>
                  <span className="text-[10px] font-bold text-neutral-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                    👥 {table.capacity}p
                  </span>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isFree ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                }`}>
                  {isFree ? '🟢 LIBRE' : '🔴 OCUPADA'}
                </span>
              </div>

              {/* Order Info or Empty Status */}
              <div className="space-y-2 mb-4">
                {isFree ? (
                  <p className="text-xs text-neutral-400 font-bold italic py-4 text-center">
                    Mesa lista para recibir clientes
                  </p>
                ) : (
                  <div className="space-y-1.5 bg-[#242426] p-3 rounded-2xl border border-white/10 text-xs">
                    <div className="flex justify-between items-center text-neutral-400 font-bold">
                      <span>Código:</span>
                      <span className="font-mono text-[#ffb700] font-black">{table.activeOrder?.code}</span>
                    </div>

                    <div className="flex justify-between items-center text-neutral-400 font-bold">
                      <span>Mozo:</span>
                      <span className="text-white font-bold">{table.activeOrder?.waiter || 'Sofía R.'}</span>
                    </div>

                    <div className="flex justify-between items-center text-neutral-400 font-bold">
                      <span>Consumos ({table.activeOrder?.items?.length || 0}):</span>
                      <span className="text-emerald-400 font-mono font-black">${table.activeOrder?.total?.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleOpenTableModal(table)}
                className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-1.5 ${
                  isFree ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-[#ffb700] hover:bg-yellow-300 text-black'
                }`}
              >
                {isFree ? (
                  <>
                    <Plus className="w-4 h-4 stroke-[3]" />
                    + ABRIR Y TOMAR PEDIDO
                  </>
                ) : (
                  <>
                    <Utensils className="w-4 h-4" />
                    VER Y ADICIONAR CUENTA (${table.activeOrder?.total?.toFixed(2)})
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* ================= MODAL 1: AGREGAR NUEVA MESA ================= */}
      {isAddTableOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddNewTable} className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-black text-white text-lg">Agregar Nueva Mesa a {activeFloor}</h3>
              <button type="button" onClick={() => setIsAddTableOpen(false)} className="w-8 h-8 rounded-full bg-[#242426] flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Nombre / Número de Mesa:</label>
                <input
                  type="text"
                  placeholder="Ej. Mesa 7, Terraza 2, Box VIP..."
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Capacidad (personas):</label>
                <select
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                >
                  <option value="2">2 Personas</option>
                  <option value="4">4 Personas</option>
                  <option value="6">6 Personas</option>
                  <option value="8">8 Personas</option>
                  <option value="12">12 Personas (Grupo)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full py-3 rounded-2xl bg-[#ffb700] text-black font-black text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors">
              + AGREGAR MESA
            </button>
          </form>
        </div>
      )}

      {/* ================= MODAL 2: TOMAR Y ADICIONAR PEDIDO DE LA MESA ================= */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#18181b] border border-white/15 rounded-3xl p-6 shadow-2xl text-white flex flex-col justify-between overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${
                  selectedTable.status === 'libre' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-white">{selectedTable.name} ({selectedTable.floor})</h3>
                  <p className="text-xs text-neutral-400 font-bold">
                    Estado: <span className={selectedTable.status === 'libre' ? 'text-emerald-400 font-black' : 'text-rose-400 font-black'}>
                      {selectedTable.status === 'libre' ? '🟢 LIBRE (Disponible)' : `🔴 OCUPADA (${selectedTable.activeOrder?.code || '#ORD'})`}
                    </span>
                  </p>
                </div>
              </div>

              <button onClick={() => setSelectedTable(null)} className="w-9 h-9 rounded-full bg-[#242426] border border-white/10 flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Split view (Left: Real Products Catalog | Right: Table Order Drawer) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-md py-4 overflow-y-auto hide-scrollbar flex-1">
              
              {/* LEFT SIDE: PRODUCT CATALOG WITH EXTRAS (7 COLS) */}
              <div className="md:col-span-7 flex flex-col gap-3">
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Catálogo de Productos para la Mesa:</h4>
                
                {/* Search & Categories */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Buscar comida, hamburguesas, bebidas..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-[#242426] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ffb700]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1">
                    {['Todas', ...categories.map(c => c?.name || c)].map(cat => (
                      <button
                        key={typeof cat === 'string' ? cat : Math.random()}
                        onClick={() => setSelectedCat(cat)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all ${
                          selectedCat === cat ? 'bg-[#ffb700] text-black font-black' : 'bg-[#242426] text-neutral-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Products Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[45vh] overflow-y-auto hide-scrollbar pr-1">
                  {filteredProducts.map(p => (
                    <div
                      key={p.id}
                      className="bg-[#242426] hover:bg-[#2c2c30] border border-white/10 rounded-2xl p-2.5 flex flex-col justify-between transition-all text-xs group"
                    >
                      <img src={p.image || '/images/burger-supreme.jpg'} alt={p.name} className="h-16 object-contain mx-auto my-1 group-hover:scale-105 transition-transform" />
                      <div>
                        <p className="font-bold text-white truncate text-[11px]">{p.name}</p>
                        <p className="font-mono text-[#ffb700] font-black mt-0.5">${Number(p.price || 0).toFixed(2)}</p>
                      </div>

                      {/* Action buttons: 1-Tap Add + Customize Extras */}
                      <div className="grid grid-cols-2 gap-1 mt-2">
                        <button
                          onClick={() => addToTableCart(p, false)}
                          className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] rounded-lg transition-colors"
                        >
                          + Añadir
                        </button>

                        <button
                          onClick={() => addToTableCart(p, true)}
                          className="py-1.5 bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-[10px] rounded-lg transition-colors flex items-center justify-center gap-0.5"
                          title="Personalizar aditivos y extras"
                        >
                          <Settings className="w-3 h-3 text-black" />
                          Extras
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT SIDE: TABLE ACCOUNT FORM & ORDER CARTS (5 COLS) */}
              <div className="md:col-span-5 bg-[#242426] border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 text-xs">
                <div>
                  <h4 className="font-black text-white text-xs uppercase tracking-wider mb-2 border-b border-white/10 pb-2">
                    Detalle del Pedido de la Mesa:
                  </h4>

                  {/* Form Metadata */}
                  <div className="space-y-2 mb-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-neutral-400 font-bold block mb-0.5">Mozo / Atendido por:</label>
                        <input
                          type="text"
                          value={waiterName}
                          onChange={(e) => setWaiterName(e.target.value)}
                          placeholder="Nombre mozo"
                          className="w-full bg-[#18181b] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#ffb700]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-400 font-bold block mb-0.5">Personas / Comensales:</label>
                        <input
                          type="number"
                          value={dinersCount}
                          onChange={(e) => setDinersCount(e.target.value)}
                          className="w-full bg-[#18181b] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#ffb700]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 font-bold block mb-0.5">Descripción / Nota Opcional:</label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej. Celebración cumpleaños, ventana..."
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#ffb700]"
                      />
                    </div>
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-2 max-h-[30vh] overflow-y-auto hide-scrollbar pr-1 border-t border-white/10 pt-2">
                    {tableCart.length === 0 ? (
                      <p className="text-neutral-500 font-bold text-center py-6">No hay productos cargados en esta mesa.</p>
                    ) : (
                      tableCart.map((item, idx) => {
                        const extrasStr = (item.options?.extras || []).map(e => e.name).join(', ');
                        const removalsStr = (item.options?.removals || []).join(', ');
                        const notesStr = item.options?.notes ? `[Nota: ${item.options.notes}]` : '';

                        return (
                          <div key={idx} className="bg-[#18181b] p-2.5 rounded-xl border border-white/10 space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="min-w-0 pr-2">
                                <p className="font-bold text-white truncate text-xs">{item.name}</p>
                                <p className="font-mono text-[#ffb700] text-[11px] font-black">${((item.price || 0) * item.quantity).toFixed(2)}</p>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => setEditingCartIndex(idx)}
                                  className="p-1 rounded-lg bg-[#242426] text-neutral-400 hover:text-[#ffb700] transition-colors"
                                  title="Editar extras"
                                >
                                  <Settings className="w-3.5 h-3.5" />
                                </button>

                                <div className="flex items-center gap-1 bg-[#242426] p-1 rounded-lg">
                                  <button onClick={() => updateTableItemQty(idx, -1)} className="w-4 h-4 text-white font-bold">-</button>
                                  <span className="w-4 text-center font-black text-white text-xs">{item.quantity}</span>
                                  <button onClick={() => updateTableItemQty(idx, 1)} className="w-4 h-4 text-white font-bold">+</button>
                                </div>

                                <button onClick={() => removeFromTableCart(idx)} className="text-rose-400 hover:text-rose-300 p-1">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Options breakdown */}
                            {(item.options?.size || extrasStr || removalsStr || notesStr) && (
                              <div className="text-[10px] text-neutral-400 font-bold bg-[#242426] p-1.5 rounded-lg leading-tight space-y-0.5">
                                {item.options?.size && <p className="text-[#ffb700]">• Tamaño: {item.options.size}</p>}
                                {extrasStr && <p className="text-emerald-400">• Extras: {extrasStr}</p>}
                                {removalsStr && <p className="text-rose-400">• {removalsStr}</p>}
                                {notesStr && <p className="text-sky-300">{notesStr}</p>}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Subtotal & Action Buttons */}
                <div className="border-t border-white/10 pt-2 space-y-2">
                  <div className="flex justify-between items-center bg-[#18181b] p-2 rounded-xl">
                    <span className="font-bold text-white">SUBTOTAL MESA:</span>
                    <span className="font-mono text-[#ffb700] font-black text-base">${cartSubtotal.toFixed(2)}</span>
                  </div>

                  {selectedTable.status === 'libre' ? (
                    <div className="space-y-1.5">
                      <button
                        onClick={() => handleConfirmTableOrder(true)}
                        className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                      >
                        <ChefHat className="w-4 h-4" />
                        🚀 ABRIR MESA Y MANDAR A COCINA
                      </button>
                    </div>
                  ) : (
                    /* Table is OCUPADA (🔴): Show Payment & Checkout controls */
                    <div className="space-y-2 pt-1 border-t border-white/10">
                      
                      {/* Payment Method Picker */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Cobrar Medio de Pago:</label>
                        <div className="grid grid-cols-4 gap-1 bg-[#18181b] p-1 rounded-xl border border-white/10">
                          {['Efectivo', 'MercadoPago', 'Tarjeta', 'Transferencia'].map((pm) => (
                            <button
                              key={pm}
                              onClick={() => setPaymentMethod(pm)}
                              className={`py-1 text-[10px] rounded-md font-bold transition-all ${
                                paymentMethod === pm ? 'bg-[#ffb700] text-black font-black' : 'text-neutral-400'
                              }`}
                            >
                              {pm}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleConfirmTableOrder(false)}
                          className="py-2.5 rounded-xl bg-[#18181b] hover:bg-[#323236] text-white font-extrabold text-xs border border-white/10 transition-colors"
                        >
                          💾 Guardar Adiciones
                        </button>

                        <button
                          onClick={handleCloseAndPayTable}
                          className="py-2.5 rounded-xl bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          ⚡ COBRAR Y LIBERAR
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
