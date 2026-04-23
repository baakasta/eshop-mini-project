import { useEffect, useState } from 'react';
import { categoryService } from '../../services';
import toast from 'react-hot-toast';
import { HiOutlineTrash } from 'react-icons/hi';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ nom: '', description: '' });
  const [loading, setLoading] = useState(true);

  const load = () => categoryService.getAllFlat().then(r => setCategories(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try { await categoryService.create(form); setForm({ nom: '', description: '' }); load(); toast.success('Catégorie créée'); } catch { toast.error('Erreur'); }
  };

  const handleDelete = async (id) => {
    try { await categoryService.delete(id); load(); toast.success('Catégorie supprimée'); } catch { toast.error('Erreur'); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Gestion des Catégories</h1>
      <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 shadow-sm mb-8 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]"><label className="block text-sm font-medium text-slate-700 mb-1">Nom</label><input type="text" required value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" /></div>
        <div className="flex-1 min-w-[200px]"><label className="block text-sm font-medium text-slate-700 mb-1">Description</label><input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" /></div>
        <button type="submit" className="px-6 py-2 gradient-primary text-white text-sm font-medium rounded-xl cursor-pointer">Ajouter</button>
      </form>
      {loading ? <div className="animate-pulse space-y-3">{[...Array(3)].map((_,i) => <div key={i} className="h-14 bg-slate-100 rounded-xl" />)}</div> : (
        <div className="space-y-2">{categories.map(c => (
          <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div><p className="font-medium text-slate-900">{c.nom}</p>{c.description && <p className="text-sm text-slate-500">{c.description}</p>}</div>
            <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"><HiOutlineTrash className="w-5 h-5" /></button>
          </div>
        ))}</div>
      )}
    </div>
  );
}
