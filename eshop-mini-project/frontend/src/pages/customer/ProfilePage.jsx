import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services';
import toast from 'react-hot-toast';
import { HiOutlineUser } from 'react-icons/hi';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ prenom: user?.prenom || '', nom: user?.nom || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userService.updateProfile(form);
      login({ ...user, prenom: res.data.prenom, nom: res.data.nom }, localStorage.getItem('token'));
      toast.success('Profil mis à jour');
    } catch { toast.error('Erreur'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Mon Profil</h1>
      <div className="bg-white rounded-2xl p-8 shadow-sm animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/30">
            <HiOutlineUser className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.prenom} {user?.nom}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="inline-block mt-1 text-xs font-bold bg-primary-50 text-primary-600 px-3 py-1 rounded-full">{user?.role}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="block text-sm font-medium text-slate-700 mb-2">Email</label><input type="email" value={user?.email || ''} disabled className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label><input type="text" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-2">Nom</label><input type="text" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
          </div>
          <button type="submit" disabled={loading} className="px-8 py-3 gradient-primary text-white font-semibold rounded-xl shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 transition-all disabled:opacity-50 cursor-pointer">{loading ? 'Sauvegarde...' : 'Sauvegarder'}</button>
        </form>
      </div>
    </div>
  );
}
