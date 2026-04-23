import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(form);
      const { token, email, prenom, nom, role } = res.data;
      login({ email, prenom, nom, role }, token);
      toast.success(`Bienvenue ${prenom} !`);
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'SELLER') navigate('/seller');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants invalides');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-600/30">
            <span className="text-white font-bold text-xl">ES</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Connexion</h1>
          <p className="text-slate-500 mt-2">Connectez-vous à votre compte E-Shop</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="votre@email.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 gradient-primary text-white font-semibold rounded-xl shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 transition-all disabled:opacity-50 cursor-pointer">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <p className="text-center text-sm text-slate-500">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">Créer un compte</Link>
          </p>
        </form>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl text-xs text-slate-500 space-y-1">
          <p className="font-medium text-slate-600">Comptes de démonstration :</p>
          <p>Admin: admin@eshop.com / admin123</p>
          <p>Vendeur: seller@eshop.com / seller123</p>
          <p>Client: customer@eshop.com / customer123</p>
        </div>
      </div>
    </div>
  );
}
