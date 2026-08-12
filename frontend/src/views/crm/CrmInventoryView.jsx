import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Plus, Package, AlertTriangle, CheckCircle2, XCircle, Grid, List, TrendingUp, ArrowDown, ArrowUp, Edit3, Trash2, X, Check, Image as ImageIcon, Sparkles, Filter } from 'lucide-react';

export default function CrmInventoryView() {
  const context = useApp() || {};
  const initialInventoryFromApp = Array.isArray(context.inventory) ? context.inventory : [];
  const handleUpdateStock = typeof context.handleUpdateStock === 'function' ? context.handleUpdateStock : () => {};
  const showToast = typeof context.showToast === 'function' ? context.showToast : () => {};

  // Comprehensive Initial Visual Inventory Items across ALL categories
  const [localInventory, setLocalInventory] = useState([
    // Bebidas
    { id: 1, name: 'Coca-Cola Zero 500ml', category: 'Bebidas y Gaseosas', stockQuantity: 120, unit: 'latas', maxStock: 200, minStock: 30, sku: 'BEB-001', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80', lastRestock: 'Hoy, 09:15 AM' },
    { id: 2, name: 'Cerveza Patagonia Amber Ale', category: 'Bebidas y Gaseosas', stockQuantity: 85, unit: 'botellas', maxStock: 150, minStock: 25, sku: 'BEB-002', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&auto=format&fit=crop&q=80', lastRestock: 'Ayer, 18:00 PM' },
    { id: 3, name: 'Agua Mineral Con Gas 600ml', category: 'Bebidas y Gaseosas', stockQuantity: 140, unit: 'botellas', maxStock: 200, minStock: 40, sku: 'BEB-003', image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80', lastRestock: 'Hoy, 08:30 AM' },
    { id: 4, name: 'Sprite Limón 500ml', category: 'Bebidas y Gaseosas', stockQuantity: 18, unit: 'latas', maxStock: 150, minStock: 30, sku: 'BEB-004', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500&auto=format&fit=crop&q=80', lastRestock: 'Hace 3 días' },

    // Hamburguesas & Carnes
    { id: 5, name: 'Medallones de Carne Certified Angus 120g', category: 'Hamburguesas y Carnes', stockQuantity: 450, unit: 'unidades', maxStock: 600, minStock: 100, sku: 'PRT-001', image: '/images/burger-supreme.jpg', lastRestock: 'Hoy, 08:30 AM' },
    { id: 6, name: 'Panes Brioche Artesanales', category: 'Panadería', stockQuantity: 300, unit: 'unidades', maxStock: 500, minStock: 80, sku: 'PAN-012', image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500&auto=format&fit=crop&q=80', lastRestock: 'Ayer, 18:00 PM' },
    { id: 7, name: 'Pechugas de Pollo Rebozadas Crispy', category: 'Hamburguesas y Carnes', stockQuantity: 180, unit: 'unidades', maxStock: 300, minStock: 50, sku: 'PRT-002', image: '/images/burger-chicken.jpg', lastRestock: 'Ayer, 14:00 PM' },

    // Quesos & Lácteos
    { id: 8, name: 'Queso Cheddar Fetear Fundido', category: 'Lácteos y Quesos', stockQuantity: 280, unit: 'fetas', maxStock: 400, minStock: 60, sku: 'LAC-005', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&auto=format&fit=crop&q=80', lastRestock: 'Hoy, 08:30 AM' },
    { id: 9, name: 'Queso Mozzarella de Búfala', category: 'Lácteos y Quesos', stockQuantity: 35, unit: 'kg', maxStock: 100, minStock: 20, sku: 'LAC-008', image: 'https://images.unsplash.com/photo-1589883661923-647640296263?w=500&auto=format&fit=crop&q=80', lastRestock: 'Hace 2 días' },

    // Papas & Guarniciones
    { id: 10, name: 'Papas Bastón McCain Corte Tradicional', category: 'Papas y Guarniciones', stockQuantity: 220, unit: 'kg', maxStock: 400, minStock: 50, sku: 'GUA-001', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80', lastRestock: 'Hoy, 10:00 AM' },
    { id: 11, name: 'Aros de Cebolla Rebozados Crujientes', category: 'Papas y Guarniciones', stockQuantity: 12, unit: 'kg', maxStock: 80, minStock: 20, sku: 'GUA-004', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&auto=format&fit=crop&q=80', lastRestock: 'Hace 4 días' },

    // Vegetales
    { id: 12, name: 'Tomates Redondos Orgánicos Frescos', category: 'Vegetales y Frescos', stockQuantity: 45, unit: 'kg', maxStock: 100, minStock: 15, sku: 'VEG-002', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80', lastRestock: 'Ayer, 09:00 AM' },
    { id: 13, name: 'Lechuga Crespa Hidropónica', category: 'Vegetales y Frescos', stockQuantity: 30, unit: 'kg', maxStock: 80, minStock: 10, sku: 'VEG-005', image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=500&auto=format&fit=crop&q=80', lastRestock: 'Hoy, 07:00 AM' },

    // Postres
    { id: 14, name: 'Milkshake de Dulce de Leche & Oreos', category: 'Postres y Helados', stockQuantity: 40, unit: 'porciones', maxStock: 100, minStock: 15, sku: 'POS-001', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80', lastRestock: 'Ayer, 16:30 PM' },
  ]);

  // Combine local inventory with any items from app context
  const fullInventory = localInventory.length > 0 ? localInventory : initialInventoryFromApp;

  // Layout View Mode: 'visual' (Large Cards Grid - DEFAULT) | 'list' (Table)
  const [viewMode, setViewMode] = useState('visual');

  // Categories Filter & Dynamic Category Creator
  const [categoriesList, setCategoriesList] = useState([
    'Todos',
    'Bebidas y Gaseosas',
    'Hamburguesas y Carnes',
    'Panadería',
    'Lácteos y Quesos',
    'Papas y Guarniciones',
    'Vegetales y Frescos',
    'Postres y Helados',
  ]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [stockAdjustItem, setStockAdjustItem] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState('ingreso'); // 'ingreso' | 'egreso'

  // New Item Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Bebidas y Gaseosas');
  const [newStock, setNewStock] = useState('100');
  const [newUnit, setNewUnit] = useState('unidades');
  const [newMaxStock, setNewMaxStock] = useState('200');
  const [newMinStock, setNewMinStock] = useState('30');
  const [newSku, setNewSku] = useState('');
  const [newImage, setNewImage] = useState('');

  // New Custom Category Name Form
  const [newCustomCategoryName, setNewCustomCategoryName] = useState('');

  // Category Icon Mapper
  const getCategoryIcon = (catName) => {
    const lower = (catName || '').toLowerCase();
    if (lower === 'todos') return 'grid_view';
    if (lower.includes('bebida') || lower.includes('gaseosa')) return 'local_bar';
    if (lower.includes('hamburguesa') || lower.includes('carne')) return 'lunch_dining';
    if (lower.includes('panaderia') || lower.includes('pan')) return 'bakery_dining';
    if (lower.includes('lacteo') || lower.includes('queso')) return 'cheese';
    if (lower.includes('papa') || lower.includes('guarnicion')) return 'fastfood';
    if (lower.includes('vegetal') || lower.includes('fresco')) return 'nutrition';
    if (lower.includes('postre') || lower.includes('helado')) return 'icecream';
    return 'inventory_2';
  };

  // Filter inventory items
  const filteredItems = fullInventory.filter(item => {
    if (!item) return false;
    const matchesCat = selectedCategory === 'Todos' || item.category === selectedCategory;
    const itemName = (item.name || '').toLowerCase();
    const itemSku = (item.sku || '').toLowerCase();
    const matchesSearch = itemName.includes(searchQuery.toLowerCase()) || itemSku.includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Calculate Quick Stats
  const totalItems = fullInventory.length;
  const lowStockCount = fullInventory.filter(i => (i.stockQuantity || 0) <= (i.minStock || 30)).length;
  const outOfStockCount = fullInventory.filter(i => (i.stockQuantity || 0) <= 0).length;

  // Submit New Item
  const handleAddNewItem = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItemObj = {
      id: Date.now(),
      name: newName.trim(),
      category: newCategory,
      stockQuantity: parseInt(newStock) || 0,
      unit: newUnit || 'unidades',
      maxStock: parseInt(newMaxStock) || 200,
      minStock: parseInt(newMinStock) || 30,
      sku: newSku.trim() || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      image: newImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
      lastRestock: 'Justo ahora'
    };

    setLocalInventory(prev => [newItemObj, ...prev]);
    showToast(`📦 "${newName}" agregado al inventario en ${newCategory}`);

    // Reset Form
    setNewName('');
    setNewStock('100');
    setNewSku('');
    setNewImage('');
    setShowAddModal(false);
  };

  // Create New Custom Category
  const handleAddCustomCategory = (e) => {
    e.preventDefault();
    if (!newCustomCategoryName.trim()) return;

    const trimmed = newCustomCategoryName.trim();
    if (!categoriesList.includes(trimmed)) {
      setCategoriesList(prev => [...prev, trimmed]);
      setSelectedCategory(trimmed);
      showToast(`✨ Nueva categoría "${trimmed}" agregada`);
    }

    setNewCustomCategoryName('');
    setShowAddCategoryModal(false);
  };

  // Quick Stock Adjustment (+ Ingreso / - Egreso)
  const handleQuickAdjustStock = (item, delta) => {
    setLocalInventory(prev => prev.map(i => {
      if (i.id === item.id) {
        const updatedQty = Math.max(0, (i.stockQuantity || 0) + delta);
        return { ...i, stockQuantity: updatedQty, lastRestock: 'Justo ahora' };
      }
      return i;
    }));

    handleUpdateStock(item.id, Math.max(0, (item.stockQuantity || 0) + delta));
    showToast(`${delta > 0 ? '🟢 + Ingreso' : '🔴 - Egreso'} de ${Math.abs(delta)} ${item.unit} en "${item.name}"`);
  };

  // Modal Custom Stock Adjustment
  const handleSaveStockAdjustment = (e) => {
    e.preventDefault();
    if (!stockAdjustItem || !adjustAmount) return;

    const amount = parseInt(adjustAmount) || 0;
    const delta = adjustType === 'ingreso' ? amount : -amount;

    handleQuickAdjustStock(stockAdjustItem, delta);
    setStockAdjustItem(null);
    setAdjustAmount('');
  };

  return (
    <div className="flex flex-col w-full gap-lg font-sans">
      
      {/* ================= MODAL 1: AÑADIR NUEVO PRODUCTO / INSUMO ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddNewItem} className="w-full max-w-lg bg-[#18181b] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#ffb700]" />
                <h3 className="font-black text-white text-lg">Añadir Producto o Insumo al Inventario</h3>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-[#242426] flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Nombre del Producto / Insumo:</label>
                <input
                  type="text"
                  placeholder="Ej. Coca-Cola Zero 500ml, Pechugas Crispy, Queso Cheddar..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Categoría:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  >
                    {categoriesList.filter(c => c !== 'Todos').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Unidad de Medida:</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  >
                    <option value="unidades">Unidades (un)</option>
                    <option value="latas">Latas</option>
                    <option value="botellas">Botellas</option>
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="litros">Litros (L)</option>
                    <option value="fetas">Fetas</option>
                    <option value="porciones">Porciones</option>
                    <option value="cajas">Cajas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Stock Inicial:</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Stock Mínimo (Alerta):</label>
                  <input
                    type="number"
                    value={newMinStock}
                    onChange={(e) => setNewMinStock(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Stock Máximo:</label>
                  <input
                    type="number"
                    value={newMaxStock}
                    onChange={(e) => setNewMaxStock(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Código SKU / Identificador (Opcional):</label>
                <input
                  type="text"
                  placeholder="Ej. BEB-005, PRT-010"
                  value={newSku}
                  onChange={(e) => setNewSku(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">URL de la Imagen Visual (Opcional):</label>
                <input
                  type="url"
                  placeholder="https://... URL de la imagen del producto"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 rounded-2xl bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider shadow-lg transition-all">
              📦 REGISTRAR EN INVENTARIO VISUAL
            </button>
          </form>
        </div>
      )}

      {/* ================= MODAL 2: CREAR NUEVA CATEGORÍA ================= */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddCustomCategory} className="w-full max-w-md bg-[#18181b] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-black text-white text-base">Crear Nueva Categoría de Inventario</h3>
              <button type="button" onClick={() => setShowAddCategoryModal(false)} className="w-8 h-8 rounded-full bg-[#242426] flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-neutral-300 block">Nombre de la Categoría:</label>
              <input
                type="text"
                placeholder="Ej. Cervezas & Tragos, Envasados, Snack Bar..."
                value={newCustomCategoryName}
                onChange={(e) => setNewCustomCategoryName(e.target.value)}
                className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                required
              />
            </div>

            <button type="submit" className="w-full py-3 rounded-2xl bg-[#ffb700] text-black font-black text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors">
              + CREAR CATEGORÍA
            </button>
          </form>
        </div>
      )}

      {/* ================= MODAL 3: AJUSTAR STOCK (ENTRADA / SALIDA) ================= */}
      {stockAdjustItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSaveStockAdjustment} className="w-full max-w-md bg-[#18181b] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-black text-white text-base">Ajustar Stock: {stockAdjustItem.name}</h3>
                <p className="text-xs text-neutral-400 font-bold">Stock actual: {stockAdjustItem.stockQuantity} {stockAdjustItem.unit}</p>
              </div>
              <button type="button" onClick={() => setStockAdjustItem(null)} className="w-8 h-8 rounded-full bg-[#242426] flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-[#242426] p-1 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setAdjustType('ingreso')}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${
                    adjustType === 'ingreso' ? 'bg-emerald-600 text-white font-black' : 'text-neutral-400'
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                  + Ingreso / Compra
                </button>

                <button
                  type="button"
                  onClick={() => setAdjustType('egreso')}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${
                    adjustType === 'egreso' ? 'bg-rose-600 text-white font-black' : 'text-neutral-400'
                  }`}
                >
                  <ArrowDown className="w-4 h-4" />
                  - Egreso / Desperdicio
                </button>
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Cantidad de {stockAdjustItem.unit}:</label>
                <input
                  type="number"
                  placeholder="Ej. 50"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2.5 text-lg font-mono font-black text-center text-[#ffb700] outline-none focus:border-[#ffb700]"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 rounded-2xl bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider shadow-lg transition-all">
              GUARDAR CAMBIO DE STOCK
            </button>
          </form>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Control e Inventario Visual</h1>
          <p className="text-xs text-neutral-400 font-bold">Monitoriza en tiempo real bebidas, comidas, insumos y mercadería con imágenes claras</p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#242426] p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setViewMode('visual')}
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'visual' ? 'bg-[#ffb700] text-black font-black' : 'text-neutral-400 hover:text-white'
              }`}
              title="Grilla de Tarjetas Visuales Grandes"
            >
              <Grid className="w-4 h-4" />
              <span>Grilla Visual</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-[#ffb700] text-black font-black' : 'text-neutral-400 hover:text-white'
              }`}
              title="Tabla de Lista Compacta"
            >
              <List className="w-4 h-4" />
              <span>Tabla</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 text-black stroke-[3]" />
            + Añadir Producto / Insumo
          </button>
        </div>
      </div>

      {/* Quick Inventory Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-md">
        <div className="bg-[#18181b] border border-white/10 p-4 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <p className="text-xs text-neutral-400 font-bold">Total Ítems en Inventario</p>
            <p className="text-2xl font-black text-white font-mono">{totalItems}</p>
          </div>
          <Package className="w-8 h-8 text-[#ffb700]" />
        </div>

        <div className="bg-[#18181b] border border-amber-500/30 p-4 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <p className="text-xs text-amber-400 font-bold">Stock Bajo (Alertas ⚠️)</p>
            <p className="text-2xl font-black text-amber-300 font-mono">{lowStockCount}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-400/60" />
        </div>

        <div className="bg-[#18181b] border border-rose-500/30 p-4 rounded-3xl flex items-center justify-between shadow-xl col-span-2 sm:col-span-1">
          <div>
            <p className="text-xs text-rose-400 font-bold">Sin Stock / Agotados (🔴)</p>
            <p className="text-2xl font-black text-rose-300 font-mono">{outOfStockCount}</p>
          </div>
          <XCircle className="w-8 h-8 text-rose-500/60" />
        </div>
      </div>

      {/* Search Bar & Visual Category Bar */}
      <div className="flex flex-col gap-3 bg-[#18181b] p-4 rounded-3xl border border-white/10 shadow-xl">
        
        {/* Top Controls: Search + Add Custom Category Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar insumo o bebida por nombre o código SKU (ej. Coca, Medallones, BEB-001)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#242426] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ffb700]"
            />
          </div>

          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-[#242428] hover:bg-[#ffb700] hover:text-black text-white border border-white/10 text-xs font-extrabold flex items-center gap-1.5 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            + Nueva Categoría
          </button>
        </div>

        {/* Touch Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
          {categoriesList.map((catName) => {
            const isActive = selectedCategory === catName;
            const catItemCount = catName === 'Todos' ? fullInventory.length : fullInventory.filter(i => i.category === catName).length;

            return (
              <button
                key={catName}
                onClick={() => setSelectedCategory(catName)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-extrabold transition-all shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#ffb700] text-black font-black shadow-md scale-105'
                    : 'bg-[#242426] border border-white/10 text-neutral-300 hover:text-white hover:bg-[#2c2c30]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {getCategoryIcon(catName)}
                </span>
                <span>{catName}</span>
                <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-white'}`}>
                  {catItemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= INVENTORY CONTENT: VISUAL CARDS GRID (DEFAULT) ================= */}
      {viewMode === 'visual' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg">
          {filteredItems.map((item) => {
            const isLow = (item.stockQuantity || 0) <= (item.minStock || 30);
            const isOut = (item.stockQuantity || 0) <= 0;
            const percentage = Math.min(100, Math.round(((item.stockQuantity || 0) / (item.maxStock || 200)) * 100));

            return (
              <div
                key={item.id}
                className="group relative bg-[#18181b] border border-white/10 hover:border-[#ffb700]/50 rounded-3xl p-4 flex flex-col justify-between shadow-xl transition-all duration-200 overflow-hidden"
              >
                {/* Visual Image Header */}
                <div className="relative w-full h-44 rounded-2xl bg-[#242426] overflow-hidden mb-3 flex items-center justify-center">
                  <img
                    src={item.image || '/images/burger-supreme.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/burger-supreme.jpg';
                    }}
                  />

                  {/* Category Pill Tag */}
                  <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-1 rounded-full border border-white/10">
                    {item.category}
                  </span>

                  {/* Stock Status Badge */}
                  <span className={`absolute top-2.5 right-2.5 text-[10px] font-black px-2.5 py-1 rounded-full border shadow-md ${
                    isOut ? 'bg-rose-500/80 text-white border-rose-400' : (isLow ? 'bg-amber-500/80 text-black border-amber-300' : 'bg-emerald-500/80 text-white border-emerald-300')
                  }`}>
                    {isOut ? '🔴 AGOTADO' : (isLow ? '⚠️ STOCK BAJO' : '🟢 OK')}
                  </span>
                </div>

                {/* Info & SKU */}
                <div className="space-y-2 mb-3">
                  <div>
                    <h3 className="font-extrabold text-white text-sm line-clamp-1 group-hover:text-[#ffb700] transition-colors">{item.name}</h3>
                    <p className="text-[11px] text-neutral-400 font-mono">SKU: {item.sku}</p>
                  </div>

                  {/* Visual Stock Level Progress Bar */}
                  <div className="space-y-1 bg-[#242426] p-2.5 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-400 font-bold">Existencias:</span>
                      <span className="font-mono text-[#ffb700] font-black text-sm">{item.stockQuantity} {item.unit}</span>
                    </div>

                    <div className="w-full h-2 bg-[#18181b] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOut ? 'bg-rose-500' : (isLow ? 'bg-amber-400' : 'bg-[#ffb700]')
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick 1-Tap Adjust Buttons: + Ingreso / - Egreso */}
                <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleQuickAdjustStock(item, 10)}
                    className="py-2 px-1 bg-emerald-950/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl font-black text-[11px] flex items-center justify-center gap-1 transition-all active:scale-95"
                    title="Registrar ingreso / compra (+10)"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    + Ingreso
                  </button>

                  <button
                    onClick={() => handleQuickAdjustStock(item, -10)}
                    className="py-2 px-1 bg-rose-950/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl font-black text-[11px] flex items-center justify-center gap-1 transition-all active:scale-95"
                    title="Registrar salida / consumo (-10)"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    - Egreso
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* TABULAR COMPACT LIST VIEW */
        <div className="bg-[#18181b] border border-white/10 rounded-3xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#242426] text-neutral-400 font-bold border-b border-white/10 uppercase tracking-wider">
                  <th className="py-3 px-4">Producto / Insumo</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Nivel de Stock</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones Rápida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredItems.map((item) => {
                  const isLow = (item.stockQuantity || 0) <= (item.minStock || 30);
                  const isOut = (item.stockQuantity || 0) <= 0;

                  return (
                    <tr key={item.id} className="hover:bg-[#222226] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image || '/images/burger-supreme.jpg'} alt="" className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                          <div>
                            <p className="font-bold text-white text-sm">{item.name}</p>
                            <p className="text-[10px] text-neutral-400 font-mono">SKU: {item.sku}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-neutral-300">{item.category}</td>

                      <td className="py-3 px-4 font-mono font-black text-sm text-[#ffb700]">
                        {item.stockQuantity} {item.unit}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          isOut ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (isLow ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30')
                        }`}>
                          {isOut ? '🔴 AGOTADO' : (isLow ? '⚠️ STOCK BAJO' : '🟢 EN STOCK')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleQuickAdjustStock(item, 10)}
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px]"
                          >
                            + 10
                          </button>
                          <button
                            onClick={() => handleQuickAdjustStock(item, -10)}
                            className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-bold text-[11px]"
                          >
                            - 10
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
