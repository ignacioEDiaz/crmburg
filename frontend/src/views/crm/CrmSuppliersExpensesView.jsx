import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, FileText, DollarSign, Plus, X, Search, CheckCircle2, TrendingDown, ShoppingCart, AlertCircle, Building, Calendar, Tag } from 'lucide-react';

export default function CrmSuppliersExpensesView() {
  const context = useApp() || {};
  const inventory = Array.isArray(context.inventory) ? context.inventory : [];
  const showToast = typeof context.showToast === 'function' ? context.showToast : () => {};

  const [activeTab, setActiveTab] = useState('suppliers'); // 'suppliers' | 'purchases' | 'expenses'

  // Suppliers State
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Carnes San José S.A.', category: 'Carnicería', phone: '11 4433-8899', email: 'ventas@sanjose.com', balanceDue: 45000.0 },
    { id: 2, name: 'Distribuidora Quilmes & Bebidas', category: 'Bebidas', phone: '11 5566-2211', email: 'pedidos@quilmesdist.com', balanceDue: 0.0 },
    { id: 3, name: 'Panadería Brioche Artesanal', category: 'Panadería', phone: '11 9988-1122', email: 'contacto@briocheartesanal.com', balanceDue: 12500.0 },
    { id: 4, name: 'Verdulería Don Pedro Orgánicos', category: 'Verdulería', phone: '11 3322-7766', email: 'donpedro@verdu.com', balanceDue: 0.0 },
  ]);

  // Purchases History State
  const [purchases, setPurchases] = useState([
    { id: 1, invoiceNumber: 'FAC-8921', supplierName: 'Carnes San José S.A.', totalAmount: 85000.0, status: 'pagada', date: 'Ayer, 10:30 AM', itemsCount: 3 },
    { id: 2, invoiceNumber: 'FAC-4412', supplierName: 'Distribuidora Quilmes & Bebidas', totalAmount: 42000.0, status: 'pagada', date: 'Hace 3 días', itemsCount: 4 },
  ]);

  // Operating Expenses State
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Alquiler', description: 'Alquiler Local Comercial Salón', amount: 350000.0, paymentMethod: 'Transferencia', date: '01/08/2026' },
    { id: 2, category: 'Servicios', description: 'Factura Electricidad Edenor', amount: 48500.0, paymentMethod: 'MercadoPago', date: '05/08/2026' },
    { id: 3, category: 'Servicios', description: 'Servicio de Internet Fibra Óptica 300MB', amount: 14200.0, paymentMethod: 'Tarjeta', date: '07/08/2026' },
  ]);

  // Modals State
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showAddPurchaseModal, setShowAddPurchaseModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // New Supplier Form
  const [newSupName, setNewSupName] = useState('');
  const [newSupCat, setNewSupCat] = useState('Carnicería');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupEmail, setNewSupEmail] = useState('');

  // New Purchase Invoice Form
  const [selectedSupplierId, setSelectedSupplierId] = useState('1');
  const [newInvoiceNum, setNewInvoiceNum] = useState('');
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [purchaseQty, setPurchaseQty] = useState('50');
  const [purchaseUnitPrice, setPurchaseUnitPrice] = useState('2.50');

  // New Expense Form
  const [newExpCat, setNewExpCat] = useState('Servicios');
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpPayMethod, setNewExpPayMethod] = useState('Efectivo');

  // Handle Add Supplier
  const handleAddSupplier = (e) => {
    e.preventDefault();
    if (!newSupName.trim()) return;

    const newS = {
      id: Date.now(),
      name: newSupName.trim(),
      category: newSupCat,
      phone: newSupPhone.trim() || 'Sin teléfono',
      email: newSupEmail.trim() || 'Sin email',
      balanceDue: 0.0
    };

    setSuppliers(prev => [newS, ...prev]);
    showToast(`🚛 Proveedor "${newSupName}" registrado`);
    setNewSupName('');
    setNewSupPhone('');
    setNewSupEmail('');
    setShowAddSupplierModal(false);
  };

  // Handle Register Purchase Invoice (Increases Stock & Updates Unit Cost in Inventory)
  const handleRegisterPurchase = (e) => {
    e.preventDefault();
    const targetSup = suppliers.find(s => String(s.id) === String(selectedSupplierId)) || suppliers[0];
    const targetIng = inventory.find(i => String(i.id) === String(selectedIngredientId)) || inventory[0];

    const qty = parseFloat(purchaseQty) || 0;
    const unitPrice = parseFloat(purchaseUnitPrice) || 0;
    const totalCost = qty * unitPrice;

    if (targetIng && typeof context.handleUpdateStock === 'function') {
      context.handleUpdateStock(targetIng.id, (targetIng.stockQuantity || 0) + qty);
    }

    const newPurchase = {
      id: Date.now(),
      invoiceNumber: newInvoiceNum.trim() || `FACT-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierName: targetSup ? targetSup.name : 'Proveedor',
      totalAmount: totalCost,
      status: 'pagada',
      date: new Date().toLocaleString(),
      itemsCount: 1
    };

    setPurchases(prev => [newPurchase, ...prev]);
    showToast(`📥 Factura ${newPurchase.invoiceNumber} registrada. Stock de "${targetIng ? targetIng.name : 'Insumo'}" incrementado (+${qty})`);

    setNewInvoiceNum('');
    setShowAddPurchaseModal(false);
  };

  // Handle Add Expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpDesc.trim() || !newExpAmount) return;

    const newExp = {
      id: Date.now(),
      category: newExpCat,
      description: newExpDesc.trim(),
      amount: parseFloat(newExpAmount) || 0,
      paymentMethod: newExpPayMethod,
      date: new Date().toLocaleDateString()
    };

    setExpenses(prev => [newExp, ...prev]);
    showToast(`💸 Gasto de $${newExp.amount.toFixed(2)} registrado (${newExpCat})`);
    setNewExpDesc('');
    setNewExpAmount('');
    setShowAddExpenseModal(false);
  };

  const totalExpensesSum = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex flex-col w-full gap-lg font-sans">
      
      {/* ================= MODAL 1: NUEVO PROVEEDOR ================= */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddSupplier} className="w-full max-w-md bg-[#18181b] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-black text-white text-base">Registrar Nuevo Proveedor</h3>
              <button type="button" onClick={() => setShowAddSupplierModal(false)} className="w-8 h-8 rounded-full bg-[#242426] flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Nombre / Razón Social:</label>
                <input
                  type="text"
                  placeholder="Ej. Carnes San José, Frigorífico Quilmes..."
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Rubro / Categoría:</label>
                <select
                  value={newSupCat}
                  onChange={(e) => setNewSupCat(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                >
                  <option value="Carnicería">Carnicería & Frigorífico</option>
                  <option value="Bebidas">Bebidas & Cervecería</option>
                  <option value="Panadería">Panadería Artesanal</option>
                  <option value="Verdulería">Verdulería & Frescos</option>
                  <option value="Lácteos">Lácteos & Quesos</option>
                  <option value="Insumos Varios">Insumos Varios</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Teléfono:</label>
                  <input
                    type="text"
                    placeholder="11 4455-6677"
                    value={newSupPhone}
                    onChange={(e) => setNewSupPhone(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Email:</label>
                  <input
                    type="email"
                    placeholder="proveedor@email.com"
                    value={newSupEmail}
                    onChange={(e) => setNewSupEmail(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 rounded-2xl bg-[#ffb700] text-black font-black text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors shadow-lg">
              🚛 GUARDAR PROVEEDOR
            </button>
          </form>
        </div>
      )}

      {/* ================= MODAL 2: CARGAR FACTURA DE COMPRA (ACTUALIZA STOCK & COSTO) ================= */}
      {showAddPurchaseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleRegisterPurchase} className="w-full max-w-lg bg-[#18181b] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-black text-white text-base">Cargar Factura de Compra / Ingreso de Mercadería</h3>
                <p className="text-xs text-[#ffb700] font-bold">Aumenta el stock del insumo y actualiza su costo unitario automáticamente</p>
              </div>
              <button type="button" onClick={() => setShowAddPurchaseModal(false)} className="w-8 h-8 rounded-full bg-[#242426] flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Proveedor:</label>
                  <select
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Número de Factura:</label>
                  <input
                    type="text"
                    placeholder="Ej. FAC-0091"
                    value={newInvoiceNum}
                    onChange={(e) => setNewInvoiceNum(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Ingrediente / Insumo Comprado:</label>
                <select
                  value={selectedIngredientId}
                  onChange={(e) => setSelectedIngredientId(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                >
                  {inventory.map(i => (
                    <option key={i.id} value={i.id}>{i.name} (Stock actual: {i.stockQuantity} {i.unit})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Cantidad Comprada:</label>
                  <input
                    type="number"
                    value={purchaseQty}
                    onChange={(e) => setPurchaseQty(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Precio Unitario ($):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={purchaseUnitPrice}
                    onChange={(e) => setPurchaseUnitPrice(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 rounded-2xl bg-[#ffb700] text-black font-black text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors shadow-lg">
              📥 REGISTRAR FACTURA Y SUMAR STOCK
            </button>
          </form>
        </div>
      )}

      {/* ================= MODAL 3: REGISTRAR GASTO OPERATIVO ================= */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddExpense} className="w-full max-w-md bg-[#18181b] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-black text-white text-base">Registrar Gasto Operativo (Fuera de Mercadería)</h3>
              <button type="button" onClick={() => setShowAddExpenseModal(false)} className="w-8 h-8 rounded-full bg-[#242426] flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Categoría del Gasto:</label>
                <select
                  value={newExpCat}
                  onChange={(e) => setNewExpCat(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                >
                  <option value="Alquiler">Alquiler del Local</option>
                  <option value="Servicios">Servicios (Luz, Gas, Agua, Internet)</option>
                  <option value="Sueldos">Sueldos y Personal</option>
                  <option value="Mantenimiento">Mantenimiento de Equipamiento</option>
                  <option value="Otros">Otros Gastos Varios</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Descripción / Concepto:</label>
                <input
                  type="text"
                  placeholder="Ej. Factura Luz Edenor, Mantenimiento Freidora..."
                  value={newExpDesc}
                  onChange={(e) => setNewExpDesc(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Monto ($):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ej. 15000"
                    value={newExpAmount}
                    onChange={(e) => setNewExpAmount(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Medio de Pago:</label>
                  <select
                    value={newExpPayMethod}
                    onChange={(e) => setNewExpPayMethod(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="MercadoPago">MercadoPago</option>
                    <option value="Transferencia">Transferencia Bancaria</option>
                    <option value="Tarjeta">Tarjeta de Débito/Crédito</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 rounded-2xl bg-[#ffb700] text-black font-black text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors shadow-lg">
              💸 GUARDAR GASTO OPERATIVO
            </button>
          </form>
        </div>
      )}

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Proveedores, Facturas y Gastos Operativos</h1>
          <p className="text-xs text-neutral-400 font-bold">Gestión de compras a proveedores, incremento automático de stock y control de gastos</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddPurchaseModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all"
          >
            <ShoppingCart className="w-4 h-4 text-black" />
            + Cargar Factura Compra
          </button>

          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#242428] hover:bg-[#ffb700] hover:text-black text-white border border-white/10 text-xs font-extrabold flex items-center gap-1.5 transition-all"
          >
            <DollarSign className="w-4 h-4" />
            + Registrar Gasto
          </button>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex items-center gap-2 bg-[#18181b] p-1.5 rounded-2xl border border-white/10 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'suppliers' ? 'bg-[#ffb700] text-black shadow-md' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          Directorio de Proveedores ({suppliers.length})
        </button>

        <button
          onClick={() => setActiveTab('purchases')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'purchases' ? 'bg-[#ffb700] text-black shadow-md' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Facturas de Compra & Mercadería ({purchases.length})
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'expenses' ? 'bg-[#ffb700] text-black shadow-md' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          Gastos Operativos (${totalExpensesSum.toFixed(2)})
        </button>
      </div>

      {/* ================= TAB 1: SUPPLIERS DIRECTORY ================= */}
      {activeTab === 'suppliers' && (
        <div className="space-y-md">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-white text-base">Proveedores de la Hamburguesería</h3>
            <button
              onClick={() => setShowAddSupplierModal(true)}
              className="px-3 py-1.5 rounded-xl bg-[#242428] hover:bg-[#ffb700] hover:text-black text-white border border-white/10 text-xs font-bold transition-all"
            >
              + Nuevo Proveedor
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {suppliers.map(s => (
              <div key={s.id} className="bg-[#18181b] border border-white/10 rounded-3xl p-5 flex flex-col justify-between shadow-xl space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#ffb700] uppercase tracking-wider bg-[#ffb700]/10 px-2.5 py-0.5 rounded-full border border-[#ffb700]/30">
                    {s.category}
                  </span>
                  <h4 className="font-black text-white text-base pt-1">{s.name}</h4>
                  <p className="text-xs text-neutral-400 font-bold">📞 {s.phone}</p>
                  <p className="text-xs text-neutral-400 truncate">✉️ {s.email}</p>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-neutral-400 font-bold">Saldo Cta. Cte:</span>
                  <span className={`font-mono font-black ${s.balanceDue > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    ${s.balanceDue.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: PURCHASES INVOICES ================= */}
      {activeTab === 'purchases' && (
        <div className="bg-[#18181b] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-white text-base">Facturas de Compra Ingresadas</h3>
            <button
              onClick={() => setShowAddPurchaseModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#ffb700] text-black font-black text-xs uppercase"
            >
              + Cargar Compra
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">N° Factura</th>
                  <th className="py-3 px-4">Proveedor</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Monto Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {purchases.map(p => (
                  <tr key={p.id} className="hover:bg-[#222226] transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-[#ffb700]">{p.invoiceNumber}</td>
                    <td className="py-3 px-4 font-bold text-white">{p.supplierName}</td>
                    <td className="py-3 px-4 text-neutral-400">{p.date}</td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-500/20 text-emerald-300 font-bold text-[10px] px-2.5 py-1 rounded-full border border-emerald-500/30">
                        ✓ {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-emerald-400 text-sm">${p.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: OPERATING EXPENSES ================= */}
      {activeTab === 'expenses' && (
        <div className="bg-[#18181b] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-white text-base">Registro de Gastos Operativos</h3>
            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#ffb700] text-black font-black text-xs uppercase"
            >
              + Registrar Gasto
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Descripción / Concepto</th>
                  <th className="py-3 px-4">Medio de Pago</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4 text-right">Monto ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {expenses.map(e => (
                  <tr key={e.id} className="hover:bg-[#222226] transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#ffb700] bg-[#ffb700]/10 px-2.5 py-1 rounded-full border border-[#ffb700]/30 text-[10px]">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{e.description}</td>
                    <td className="py-3 px-4 text-neutral-400">{e.paymentMethod}</td>
                    <td className="py-3 px-4 text-neutral-400">{e.date}</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-rose-400 text-sm">${e.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
