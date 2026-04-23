import { useEffect, useState } from 'react';
import { productService, categoryService } from '../../services';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlinePhotograph } from 'react-icons/hi';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nom: '', description: '', prix: 0, prixPromo: '', stock: 0, images: [''], categoryIds: [] });

  const load = () => { productService.getAllAdmin().then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); categoryService.getAllFlat().then(r => setCategories(r.data)).catch(() => {}); }, []);

  const set = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, prix: +form.prix, prixPromo: form.prixPromo ? +form.prixPromo : null, stock: +form.stock, images: form.images.filter(Boolean) };
    try {
      if (editing) { await productService.update(editing, data); toast.success('Produit modifié'); }
      else { await productService.create(data); toast.success('Produit créé'); }
      setShowForm(false); setEditing(null); setForm({ nom: '', description: '', prix: 0, prixPromo: '', stock: 0, images: [''], categoryIds: [] }); load();
    } catch { toast.error('Erreur lors de la sauvegarde'); }
  };

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({ nom: p.nom, description: p.description || '', prix: p.prix, prixPromo: p.prixPromo || '', stock: p.stock, images: p.images?.length ? p.images : [''], categoryIds: p.categories?.map(c => c.id) || [] });
    setShowForm(true);
  };

  const handleDelete = async (id) => { 
    if(window.confirm('Voulez-vous vraiment désactiver ce produit ?')) {
      try { await productService.delete(id); load(); toast.success('Produit désactivé'); } catch { toast.error('Erreur'); } 
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Produits</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez tous les produits de la plateforme</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ nom: '', description: '', prix: 0, prixPromo: '', stock: 0, images: [''], categoryIds: [] }); }}
          className="flex items-center gap-2 px-5 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all">
          <HiOutlinePlus className="w-5 h-5" />{showForm ? 'Annuler' : 'Nouveau produit'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm mb-8 space-y-6 animate-scale-in border border-slate-100">
          <h3 className="font-bold text-xl text-slate-900 border-b pb-4">{editing ? 'Modifier le' : 'Nouveau'} produit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-semibold text-slate-700 mb-2">Nom du produit</label><input type="text" required value={form.nom} onChange={e => set('nom', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-2">Prix (TND)</label><input type="number" required value={form.prix} onChange={e => set('prix', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-2">Prix promotionnel</label><input type="number" value={form.prixPromo} onChange={e => set('prixPromo', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all" placeholder="Optionnel" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-2">Stock disponible</label><input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all" /></div>
          </div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-2">Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-all" rows={4} /></div>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2"><HiOutlinePhotograph className="w-5 h-5 text-primary-500"/> Images du produit (URLs)</label>
            <div className="space-y-3">
              {form.images.map((img, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input type="text" value={img} onChange={e => {
                    const newImgs = [...form.images];
                    newImgs[i] = e.target.value;
                    set('images', newImgs);
                  }} className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all" placeholder="https://example.com/image.jpg" />
                  {form.images.length > 1 && (
                    <button type="button" onClick={() => set('images', form.images.filter((_, idx) => idx !== i))} className="p-3 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors shrink-0"><HiOutlineTrash className="w-5 h-5" /></button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => set('images', [...form.images, ''])} className="inline-flex items-center gap-2 text-sm text-primary-600 font-semibold hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-lg transition-colors mt-2">
                <HiOutlinePlus className="w-4 h-4" /> Ajouter une autre image
              </button>
            </div>
          </div>

          {categories.length > 0 && (
            <div><label className="block text-sm font-semibold text-slate-700 mb-3">Catégories</label><div className="flex flex-wrap gap-2">{categories.map(c => (
              <label key={c.id} className={`text-sm px-4 py-2 rounded-xl cursor-pointer border-2 transition-all font-medium ${form.categoryIds.includes(c.id) ? 'bg-primary-50 text-primary-700 border-primary-500' : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'}`}>
                <input type="checkbox" className="hidden" checked={form.categoryIds.includes(c.id)} onChange={e => set('categoryIds', e.target.checked ? [...form.categoryIds, c.id] : form.categoryIds.filter(x => x !== c.id))} />{c.nom}
              </label>
            ))}</div></div>
          )}
          <div className="pt-4 border-t flex justify-end">
            <button type="submit" className="px-8 py-3 gradient-primary text-white font-semibold rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all">
              {editing ? 'Enregistrer les modifications' : 'Publier le produit'}
            </button>
          </div>
        </form>
      )}

      {loading ? <div className="animate-pulse space-y-4">{[...Array(4)].map((_,i) => <div key={i} className="h-24 bg-white rounded-2xl" />)}</div> : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4"><HiOutlinePhotograph className="w-8 h-8" /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Aucun produit</h3>
            <p className="text-slate-500">Commencez par ajouter des produits à votre catalogue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">{products.map(p => (
          <div key={p.id} className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center gap-5 transition-all hover:shadow-md ${!p.actif && 'opacity-60 grayscale'}`}>
            <div className="relative shrink-0">
                <img src={p.images?.[0] || 'https://placehold.co/100x100/e2e8f0/64748b?text=N/A'} alt={p.nom} className="w-24 h-24 rounded-xl object-cover" />
                {p.images?.length > 1 && <span className="absolute bottom-1 right-1 bg-slate-900/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">+{p.images.length - 1}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-slate-900 truncate">{p.nom}</h3>
                {!p.actif && <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-0.5 rounded-full">Inactif</span>}
              </div>
              <p className="text-sm text-slate-500 line-clamp-1 mb-2">{p.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">{formatPrice(p.prixPromo || p.prix)}</span>
                <span className="text-slate-500 font-medium">Stock: <span className={p.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}>{p.stock}</span></span>
                <span className="text-slate-400">Vendeur: <span className="font-medium text-slate-600">{p.sellerName || 'Inconnu'}</span></span>
              </div>
            </div>
            <div className="flex sm:flex-col gap-2 shrink-0">
              <button onClick={() => startEdit(p)} className="flex-1 sm:flex-none flex justify-center p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-colors"><HiOutlinePencil className="w-5 h-5" /></button>
              <button onClick={() => handleDelete(p.id)} disabled={!p.actif} className="flex-1 sm:flex-none flex justify-center p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><HiOutlineTrash className="w-5 h-5" /></button>
            </div>
          </div>
        ))}</div>
      )}
    </div>
  );
}
