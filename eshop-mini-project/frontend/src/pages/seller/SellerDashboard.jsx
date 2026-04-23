import { useEffect, useState } from 'react';
import { productService, categoryService } from '../../services';
import { formatPrice, formatDateShort } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlinePhotograph } from 'react-icons/hi';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nom: '', description: '', prix: 0, prixPromo: '', stock: 0, images: [''], categoryIds: [] });

  const load = () => { productService.getSellerProducts().then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); categoryService.getAllFlat().then(r => setCategories(r.data)).catch(() => {}); }, []);

  const set = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, prix: +form.prix, prixPromo: form.prixPromo ? +form.prixPromo : null, stock: +form.stock, images: form.images.filter(Boolean) };
    try {
      if (editing) { await productService.update(editing, data); toast.success('Produit modifié'); }
      else { await productService.create(data); toast.success('Produit créé'); }
      setShowForm(false); setEditing(null); setForm({ nom: '', description: '', prix: 0, prixPromo: '', stock: 0, images: [''], categoryIds: [] }); load();
    } catch { toast.error('Erreur'); }
  };

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({ nom: p.nom, description: p.description || '', prix: p.prix, prixPromo: p.prixPromo || '', stock: p.stock, images: p.images?.length ? p.images : [''], categoryIds: p.categories?.map(c => c.id) || [] });
    setShowForm(true);
  };

  const handleDelete = async (id) => { try { await productService.delete(id); load(); toast.success('Produit désactivé'); } catch { toast.error('Erreur'); } };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Mes Produits ({products.length})</h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ nom: '', description: '', prix: 0, prixPromo: '', stock: 0, images: [''], categoryIds: [] }); }}
          className="flex items-center gap-2 px-5 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl cursor-pointer"><HiOutlinePlus className="w-5 h-5" />{showForm ? 'Annuler' : 'Nouveau produit'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm mb-8 space-y-4 animate-scale-in">
          <h3 className="font-semibold text-lg">{editing ? 'Modifier' : 'Nouveau'} produit</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Nom</label><input type="text" required value={form.nom} onChange={e => set('nom', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Prix (TND)</label><input type="number" required value={form.prix} onChange={e => set('prix', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Prix promo</label><input type="number" value={form.prixPromo} onChange={e => set('prixPromo', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" placeholder="Optionnel" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Stock</label><input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" /></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none" rows={3} /></div>
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
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Catégories</label><div className="flex flex-wrap gap-2">{categories.map(c => (
              <label key={c.id} className={`text-xs px-3 py-1.5 rounded-full cursor-pointer border transition-all ${form.categoryIds.includes(c.id) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'}`}>
                <input type="checkbox" className="hidden" checked={form.categoryIds.includes(c.id)} onChange={e => set('categoryIds', e.target.checked ? [...form.categoryIds, c.id] : form.categoryIds.filter(x => x !== c.id))} />{c.nom}
              </label>
            ))}</div></div>
          )}
          <button type="submit" className="px-8 py-2.5 gradient-primary text-white font-medium rounded-xl cursor-pointer">{editing ? 'Sauvegarder' : 'Créer le produit'}</button>
        </form>
      )}

      {loading ? <div className="animate-pulse space-y-3">{[...Array(3)].map((_,i) => <div key={i} className="h-20 bg-slate-100 rounded-xl" />)}</div> : products.length === 0 ? <p className="text-center py-20 text-slate-500">Aucun produit. Créez votre premier produit !</p> : (
        <div className="space-y-3">{products.map(p => (
          <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 animate-fade-in">
            <img src={p.images?.[0] || 'https://placehold.co/80x80/e2e8f0/64748b?text=N/A'} alt={p.nom} className="w-16 h-16 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">{p.nom}</h3>
              <p className="text-sm text-primary-600 font-bold">{formatPrice(p.prixPromo || p.prix)}</p>
              <p className="text-xs text-slate-400">Stock: {p.stock} · {p.actif ? '✅ Actif' : '❌ Inactif'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-primary-50 hover:text-primary-600 cursor-pointer"><HiOutlinePencil className="w-5 h-5" /></button>
              <button onClick={() => handleDelete(p.id)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-rose-50 hover:text-rose-600 cursor-pointer"><HiOutlineTrash className="w-5 h-5" /></button>
            </div>
          </div>
        ))}</div>
      )}
    </div>
  );
}
