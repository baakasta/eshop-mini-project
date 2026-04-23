import { useEffect, useState } from 'react';
import { userService } from '../../services';
import { formatDateShort } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { userService.getAll().then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const toggle = async (id) => {
    try { const res = await userService.toggleStatus(id); setUsers(users.map(u => u.id === id ? res.data : u)); toast.success('Statut modifié'); } catch { toast.error('Erreur'); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Gestion des Utilisateurs</h1>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-4 font-semibold text-slate-600">Utilisateur</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">Email</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">Rôle</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">Statut</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">Date</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">Action</th>
            </tr></thead>
            <tbody>{users.map(u => (
              <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{u.prenom} {u.nom}</td>
                <td className="px-6 py-4 text-slate-600">{u.email}</td>
                <td className="px-6 py-4"><span className="text-xs font-bold bg-primary-50 text-primary-600 px-2 py-1 rounded-full">{u.role}</span></td>
                <td className="px-6 py-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${u.actif === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{u.actif}</span></td>
                <td className="px-6 py-4 text-slate-500">{formatDateShort(u.dateCreation)}</td>
                <td className="px-6 py-4"><button onClick={() => toggle(u.id)} className={`text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer ${u.actif === 'ACTIVE' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>{u.actif === 'ACTIVE' ? 'Désactiver' : 'Activer'}</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
