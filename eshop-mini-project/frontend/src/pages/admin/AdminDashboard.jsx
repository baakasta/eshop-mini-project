import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services';
import { HiOutlineUsers, HiOutlineCube, HiOutlineClipboardList, HiOutlineCurrencyDollar } from 'react-icons/hi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { userService.getDashboard().then(r => setStats(r.data)).catch(() => {}); }, []);

  const cards = stats ? [
    { icon: HiOutlineUsers, label: 'Utilisateurs', value: stats.totalUsers, color: 'bg-blue-50 text-blue-600', link: '/admin/users' },
    { icon: HiOutlineCube, label: 'Produits actifs', value: stats.activeProducts, color: 'bg-emerald-50 text-emerald-600', link: '/admin/products' },
    { icon: HiOutlineClipboardList, label: 'Commandes', value: stats.totalOrders, color: 'bg-amber-50 text-amber-600', link: '/admin/orders' },
    { icon: HiOutlineCurrencyDollar, label: 'Revenu total', value: `${stats.totalRevenue?.toLocaleString()} TND`, color: 'bg-purple-50 text-purple-600', link: '/admin/orders' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Tableau de bord</h1>
      {stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map((c, i) => (
            <Link key={i} to={c.link} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all animate-fade-in" style={{animationDelay:`${i*0.1}s`}}>
              <div className={`w-12 h-12 ${c.color} rounded-xl flex items-center justify-center mb-4`}><c.icon className="w-6 h-6" /></div>
              <p className="text-sm text-slate-500">{c.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{c.value}</p>
            </Link>
          ))}
        </div>
      ) : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{[...Array(4)].map((_,i) => <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse"><div className="w-12 h-12 bg-slate-200 rounded-xl mb-4" /><div className="h-4 bg-slate-200 rounded w-1/2 mb-2" /><div className="h-6 bg-slate-200 rounded w-3/4" /></div>)}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{ to: '/admin/users', label: 'Gérer Utilisateurs', desc: 'Activer/désactiver comptes' },
          { to: '/admin/products', label: 'Gérer Produits', desc: 'Ajouter/modifier les produits' },
          { to: '/admin/orders', label: 'Gérer Commandes', desc: 'Voir et mettre à jour les statuts' },
          { to: '/admin/categories', label: 'Gérer Catégories', desc: 'Ajouter/modifier les catégories' },
          { to: '/admin/coupons', label: 'Gérer Coupons', desc: 'Créer des codes promo' },
          { to: '/admin/reviews', label: 'Gérer Avis', desc: 'Approuver les avis clients' }
        ].map((item, i) => (
          <Link key={i} to={item.to} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
            <h3 className="font-semibold text-slate-900">{item.label}</h3>
            <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
