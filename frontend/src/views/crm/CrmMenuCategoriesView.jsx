import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, FolderPlus, Image as ImageIcon, Pencil, Trash2, Utensils } from 'lucide-react';

export default function CrmMenuCategoriesView() {
  const { products, categories, handleCreateCategory, handleCreateProduct, handleUpdateProduct, handleDeleteProduct } = useApp();
  const [selectedCatFilter, setSelectedCatFilter] = useState('Todas');
  
  // Modals
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Product currently being edited

  // New Category Form
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Product Form (Used for both Create and Edit)
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState(categories[0]?.name || 'Hamburguesas');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodIsSpicy, setProdIsSpicy] = useState(false);
  const [prodTag, setProdTag] = useState('');
  const [prodImage, setProdImage] = useState('');

  // Recipe Ingredient Selection
  const [recipeCarne, setRecipeCarne] = useState(1);
  const [recipePan, setRecipePan] = useState(1);
  const [recipeCheddar, setRecipeCheddar] = useState(1);

  // Open Edit Modal and pre-fill fields
  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProdName(prod.name || '');
    setProdCategory(prod.category || 'Hamburguesas');
    setProdPrice(prod.price || '');
    setProdDesc(prod.description || '');
    setProdIsSpicy(Boolean(prod.isSpicy));
    setProdTag(prod.tag || '');
    setProdImage(prod.image || '');
    setRecipeCarne(1);
    setRecipePan(1);
    setRecipeCheddar(1);
    setShowProductModal(true);
  };

  // Open Create Modal
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory(categories[0]?.name || 'Hamburguesas');
    setProdPrice('');
    setProdDesc('');
    setProdIsSpicy(false);
    setProdTag('');
    setProdImage('');
    setRecipeCarne(1);
    setRecipePan(1);
    setRecipeCheddar(1);
    setShowProductModal(true);
  };

  // Optimized image file change keeping 100% PNG transparency
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        // Clear canvas to guarantee transparent background
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        // Save as PNG to preserve transparent background
        const transparentBase64 = canvas.toDataURL('image/png');
        setProdImage(transparentBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const onSubmitCategory = (e) => {
    e.preventDefault();
    if (!catName) return;
    handleCreateCategory({ name: catName, description: catDesc });
    setCatName('');
    setCatDesc('');
    setShowCategoryModal(false);
  };

  const onSubmitProduct = (e) => {
    e.preventDefault();
    if (!prodName || !prodPrice) return;

    const payload = {
      name: prodName,
      category: prodCategory || 'Hamburguesas',
      price: Number(prodPrice),
      description: prodDesc,
      isSpicy: prodIsSpicy,
      tag: prodTag || null,
      image: prodImage || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
      recipe: {
        carne: Number(recipeCarne),
        pan: Number(recipePan),
        cheddar: Number(recipeCheddar),
      }
    };

    if (editingProduct) {
      handleUpdateProduct(editingProduct.id, payload);
    } else {
      handleCreateProduct(payload);
    }

    setShowProductModal(false);
    setEditingProduct(null);
  };

  const allCategoryNames = ['Todas', ...categories.map(c => c.name)];
  
  const displayedCategories = selectedCatFilter === 'Todas' 
    ? categories 
    : categories.filter(c => c.name === selectedCatFilter);

  return (
    <div className="flex flex-col w-full gap-xl">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
        <div>
          <h1 className="text-headline-xl font-headline-xl text-on-surface">Gestión de Menú y Categorías</h1>
          <p className="text-body-lg text-on-surface-variant mt-xs">Edita o elimina productos existentes, cambia precios, recetas, categorías e imágenes transparentes en cualquier momento.</p>
        </div>

        <div className="flex items-center gap-sm">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="bg-surface-container-high hover:bg-surface-bright text-on-surface font-bold px-lg py-sm rounded-full border border-white/10 transition-all flex items-center gap-xs"
          >
            <FolderPlus className="w-4 h-4 text-primary" />
            Nueva Categoría
          </button>

          <button
            onClick={handleOpenCreateProduct}
            className="bg-primary hover:bg-primary-container text-on-primary font-bold px-lg py-sm rounded-full shadow-md transition-all flex items-center gap-xs"
          >
            <Plus className="w-4 h-4" />
            Añadir Producto
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-sm overflow-x-auto pb-2 hide-scrollbar">
        {allCategoryNames.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCatFilter(cat)}
            className={`px-lg py-sm rounded-full font-bold text-xs transition-colors shrink-0 ${
              selectedCatFilter === cat
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-high/60 text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Categories & Products Accordion/Grid */}
      <div className="flex flex-col gap-xl">
        {displayedCategories.map(cat => {
          const categoryProducts = products.filter(p => p.category === cat.name);

          return (
            <div key={cat.id || cat.name} className="bg-surface-container-low/40 border border-white/5 rounded-3xl p-lg flex flex-col gap-md">
              <div className="flex justify-between items-center border-b border-white/10 pb-md">
                <div>
                  <h2 className="text-title-md font-bold text-on-surface flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                    {cat.name}
                  </h2>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">{cat.description || 'Productos disponibles'}</p>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                  {categoryProducts.length} Ítems
                </span>
              </div>

              {/* Products Grid in Category */}
              {categoryProducts.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant/60 py-4 italic">No hay productos en esta categoría aún.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                  {categoryProducts.map(prod => (
                    <div key={prod.id} className="bg-surface-container/60 border border-white/10 rounded-2xl p-md flex flex-col justify-between hover:bg-surface-container-highest/30 transition-all group relative">
                      
                      <div className="flex gap-md items-center">
                        <img src={prod.image} alt={prod.name} className="w-20 h-20 object-contain rounded-xl drop-shadow-md shrink-0 bg-transparent p-1" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-on-surface text-body-lg truncate">{prod.name}</h4>
                            {prod.isSpicy && <span className="text-[10px] bg-error/20 text-error px-2 py-0.5 rounded-full font-bold">Picante</span>}
                          </div>
                          <p className="text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">{prod.description}</p>
                          <p className="font-bold text-primary text-title-md mt-2">$ {Number(prod.price).toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Card Edit and Delete Actions */}
                      <div className="flex justify-end gap-2 border-t border-white/10 pt-3 mt-3">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Editar
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Nueva Categoría */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface-container-low border border-white/10 rounded-3xl p-lg w-full max-w-md flex flex-col gap-md shadow-2xl">
            <h3 className="text-headline-lg font-bold text-on-surface">Crear Nueva Categoría</h3>
            <form onSubmit={onSubmitCategory} className="flex flex-col gap-md">
              <div>
                <label className="text-xs text-on-surface-variant block mb-1 font-bold">Nombre de la Categoría</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Postres, Ensaladas, Combos Especilales..."
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl p-md text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-on-surface-variant block mb-1 font-bold">Descripción (Opcional)</label>
                <textarea
                  rows="2"
                  placeholder="Breve descripción..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl p-md text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-sm mt-md">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-md py-sm rounded-full bg-surface-container-highest text-on-surface-variant hover:text-on-surface font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-md py-sm rounded-full bg-primary text-on-primary font-bold text-xs shadow-md"
                >
                  Guardar Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Crear / Editar Producto */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface-container-low border border-white/10 rounded-3xl p-lg w-full max-w-lg flex flex-col gap-md shadow-2xl my-8">
            <h3 className="text-headline-lg font-bold text-on-surface">
              {editingProduct ? `Editar Producto: ${editingProduct.name}` : 'Añadir Nuevo Producto al Menú'}
            </h3>
            <form onSubmit={onSubmitProduct} className="flex flex-col gap-md">
              <div>
                <label className="text-xs text-on-surface-variant block mb-1 font-bold">Nombre del Producto / Combo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Hamburguesa Triple Cheese Bacon"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="text-xs text-on-surface-variant block mb-1 font-bold">Categoría</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                  >
                    {categories.map(c => (
                      <option key={c.id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-on-surface-variant block mb-1 font-bold">Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="8.99"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Recipe Ingredient Configuration */}
              <div className="bg-surface-container/60 p-md rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <Utensils className="w-4 h-4" />
                  <span>Receta e Ingredientes a Descontar del Inventario:</span>
                </div>
                <div className="grid grid-cols-3 gap-sm">
                  <div>
                    <label className="text-[11px] text-on-surface-variant block">Medallones Carne</label>
                    <input
                      type="number"
                      min="0"
                      value={recipeCarne}
                      onChange={(e) => setRecipeCarne(e.target.value)}
                      className="w-full bg-surface-container-highest rounded-lg p-2 text-xs text-on-surface font-bold text-center border border-white/10"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-on-surface-variant block">Fetas de Cheddar</label>
                    <input
                      type="number"
                      min="0"
                      value={recipeCheddar}
                      onChange={(e) => setRecipeCheddar(e.target.value)}
                      className="w-full bg-surface-container-highest rounded-lg p-2 text-xs text-on-surface font-bold text-center border border-white/10"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-on-surface-variant block">Panes Brioche</label>
                    <input
                      type="number"
                      min="0"
                      value={recipePan}
                      onChange={(e) => setRecipePan(e.target.value)}
                      className="w-full bg-surface-container-highest rounded-lg p-2 text-xs text-on-surface font-bold text-center border border-white/10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-on-surface-variant block mb-1 font-bold">Descripción</label>
                <textarea
                  rows="2"
                  placeholder="Ingredientes y detalles..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                />
              </div>

              {/* Subir Imagen */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant block font-bold">Imagen del Producto</label>
                
                <div className="flex gap-md items-center">
                  <label className="flex items-center gap-2 px-md py-sm bg-surface-container-highest rounded-xl border border-white/10 cursor-pointer hover:bg-surface-bright text-xs text-on-surface font-bold">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    Subir archivo desde mi PC (Fondo Transparente)
                    <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                  </label>
                  <span className="text-xs text-on-surface-variant">o pegar URL:</span>
                </div>

                <input
                  type="text"
                  placeholder="https://ejemplo.com/imagen.png"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl p-sm text-xs text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                />

                {prodImage && (
                  <div className="w-24 h-24 rounded-xl border border-white/10 overflow-hidden bg-transparent p-1 mt-1">
                    <img src={prodImage} alt="Vista previa" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-md">
                <label className="flex items-center gap-2 text-xs text-on-surface cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsSpicy}
                    onChange={(e) => setProdIsSpicy(e.target.checked)}
                    className="rounded accent-primary"
                  />
                  ¿Es Picante?
                </label>
              </div>

              <div className="flex justify-end gap-sm mt-md">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                  }}
                  className="px-md py-sm rounded-full bg-surface-container-highest text-on-surface-variant hover:text-on-surface font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-md py-sm rounded-full bg-primary text-on-primary font-bold text-xs shadow-md"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Guardar Producto y Receta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
