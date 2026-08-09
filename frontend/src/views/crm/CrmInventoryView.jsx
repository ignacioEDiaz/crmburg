import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function CrmInventoryView() {
  const { inventory, handleUpdateStock, handleAddIngredient } = useApp();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Add Ingredient Form
  const [newIngName, setNewIngName] = useState('');
  const [newIngCategory, setNewIngCategory] = useState('Proteínas');
  const [newIngStock, setNewIngStock] = useState(100);

  // Edit Stock Form
  const [adjustQty, setAdjustQty] = useState(0);

  const categories = ['Todos', 'Proteínas', 'Lácteos', 'Panadería', 'Vegetales'];

  const filteredInventory = inventory.filter(item => {
    const matchesCat = activeCategory === 'Todos' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.sku.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const onSubmitAdd = (e) => {
    e.preventDefault();
    if (!newIngName) return;
    handleAddIngredient({
      name: newIngName,
      category: newIngCategory,
      stockQuantity: Number(newIngStock),
      unit: 'un',
      maxStock: 500,
    });
    setNewIngName('');
    setShowAddModal(false);
  };

  const onSubmitAdjust = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    handleUpdateStock(editingItem.id, Number(adjustQty));
    setEditingItem(null);
  };

  return (
    <div className="flex flex-col w-full gap-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md relative">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="z-10 relative">
          <h1 className="text-headline-xl font-headline-xl text-on-surface">Inventario de Ingredientes</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant mt-xs">Gestiona y monitoriza el stock en tiempo real.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="z-10 relative bg-primary hover:bg-primary-container text-on-primary font-label-bold text-label-bold px-lg py-md rounded-full shadow-[0_4px_24px_rgba(255,183,127,0.3)] transition-all flex items-center justify-center gap-sm group"
        >
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-90">add</span>
          Añadir Ingrediente
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-high/40 backdrop-blur-2xl rounded-xl p-md flex flex-col md:flex-row gap-md items-center justify-between relative z-10 shadow-lg">
        <div className="relative flex-1 w-full max-w-md">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            placeholder="Buscar por nombre, categoría o SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-highest/50 rounded-full py-sm pl-[44px] pr-md text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-highest/80 transition-colors placeholder:text-on-surface-variant/50"
          />
        </div>

        <div className="flex gap-sm w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-md py-sm rounded-full text-label-bold font-label-bold flex-shrink-0 transition-colors ${
                activeCategory === cat
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-surface-container-low/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-highest/30 text-on-surface-variant font-label-bold text-label-bold uppercase tracking-wider">
                <th className="py-md px-lg font-medium">Ingrediente</th>
                <th className="py-md px-lg font-medium">Categoría</th>
                <th className="py-md px-lg font-medium">Nivel de Stock</th>
                <th className="py-md px-lg font-medium">Estado</th>
                <th className="py-md px-lg font-medium">Último Abastecimiento</th>
                <th className="py-md px-lg font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-body-sm font-body-sm">
              {filteredInventory.map((item) => {
                const isLow = item.stockQuantity < 50;
                const percentage = Math.min(100, Math.round((item.stockQuantity / (item.maxStock || 500)) * 100));

                return (
                  <tr key={item.id} className="hover:bg-surface-container-highest/20 transition-colors group relative">
                    <td className="py-lg px-lg">
                      <div className="flex items-center gap-md">
                        <div className={`w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center ${isLow ? 'text-error' : 'text-primary'}`}>
                          <span className="material-symbols-outlined">set_meal</span>
                        </div>
                        <div>
                          <p className="font-title-md text-title-md text-on-surface">{item.name}</p>
                          <p className="text-[12px] text-on-surface-variant mt-xs">SKU: {item.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-lg px-lg text-on-surface-variant">{item.category}</td>

                    <td className="py-lg px-lg">
                      <div className="flex items-center gap-md">
                        <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isLow ? 'bg-[#ffb4ab] shadow-[0_0_10px_rgba(255,180,171,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(255,183,127,0.5)]'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-on-surface font-medium">{item.stockQuantity} {item.unit}</span>
                      </div>
                    </td>

                    <td className="py-lg px-lg">
                      <span className={`inline-flex items-center gap-xs px-sm py-[2px] rounded-full text-[12px] font-label-bold ${
                        isLow ? 'bg-[#93000a]/20 text-[#ffb4ab]' : 'bg-primary/10 text-primary'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {isLow ? 'Stock Bajo' : 'En Stock'}
                      </span>
                    </td>

                    <td className="py-lg px-lg text-on-surface-variant">{item.lastRestock || 'Hoy, 08:30 AM'}</td>

                    <td className="py-lg px-lg text-right">
                      <div className="flex justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setAdjustQty(item.stockQuantity);
                          }}
                          className="p-xs rounded-lg hover:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-colors"
                          title="Ajustar Stock"
                        >
                          <span className="material-symbols-outlined text-[20px]">tune</span>
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

      {/* Add Ingredient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-surface-container-low border border-white/10 rounded-3xl p-lg w-full max-w-md flex flex-col gap-md shadow-2xl">
            <h3 className="text-headline-lg text-on-surface">Añadir Nuevo Ingrediente</h3>
            <form onSubmit={onSubmitAdd} className="flex flex-col gap-md">
              <div>
                <label className="text-xs text-on-surface-variant block mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Tomates Orgánicos"
                  value={newIngName}
                  onChange={(e) => setNewIngName(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-on-surface-variant block mb-1">Categoría</label>
                <select
                  value={newIngCategory}
                  onChange={(e) => setNewIngCategory(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                >
                  <option value="Proteínas">Proteínas</option>
                  <option value="Panadería">Panadería</option>
                  <option value="Lácteos">Lácteos</option>
                  <option value="Vegetales">Vegetales</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-on-surface-variant block mb-1">Cantidad Inicial</label>
                <input
                  type="number"
                  min="0"
                  value={newIngStock}
                  onChange={(e) => setNewIngStock(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-sm mt-md">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-md py-sm rounded-full bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-md py-sm rounded-full bg-primary text-on-primary font-bold shadow-lg"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-surface-container-low border border-white/10 rounded-3xl p-lg w-full max-w-md flex flex-col gap-md shadow-2xl">
            <h3 className="text-headline-lg text-on-surface">Ajustar Stock: {editingItem.name}</h3>
            <form onSubmit={onSubmitAdjust} className="flex flex-col gap-md">
              <div>
                <label className="text-xs text-on-surface-variant block mb-1">Nueva Cantidad ({editingItem.unit})</label>
                <input
                  type="number"
                  min="0"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl p-md text-headline-lg text-primary border border-white/10 text-center font-bold focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-sm mt-md">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-md py-sm rounded-full bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-md py-sm rounded-full bg-primary text-on-primary font-bold shadow-lg"
                >
                  Actualizar Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
