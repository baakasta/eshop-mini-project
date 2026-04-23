import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { HiOutlineShoppingCart, HiOutlineUser, HiOutlineLogout, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin, isSeller } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30 group-hover:shadow-primary-600/50 transition-shadow">
              <span className="text-white font-bold text-sm">ES</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">E-Shop</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Accueil</Link>
            <Link to="/products" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Produits</Link>
            {user && isAdmin() && <Link to="/admin" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Admin</Link>}
            {user && isSeller() && <Link to="/seller" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Vendeur</Link>}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {!isAdmin() && (
                  <Link to="/cart" className="relative p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                    <HiOutlineShoppingCart className="w-6 h-6" />
                    {cart.itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-scale-in">{cart.itemCount}</span>
                    )}
                  </Link>
                )}
                <Link to="/profile" className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                  <HiOutlineUser className="w-6 h-6" />
                </Link>
                <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                  <span className="text-sm font-medium text-slate-700">{user.prenom}</span>
                  <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                    <HiOutlineLogout className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-5 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-xl transition-all">Connexion</Link>
                <Link to="/register" className="px-5 py-2 text-sm font-medium text-white gradient-primary rounded-xl shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 transition-all">Inscription</Link>
              </div>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
            {menuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-2 animate-fade-in">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-primary-50 rounded-lg">Accueil</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-primary-50 rounded-lg">Produits</Link>
            {user ? (
              <>
                {!isAdmin() && <Link to="/cart" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-primary-50 rounded-lg">Panier ({cart.itemCount})</Link>}
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-primary-50 rounded-lg">Profil</Link>
                {isAdmin() && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-primary-50 rounded-lg">Admin</Link>}
                {isSeller() && <Link to="/seller" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-primary-50 rounded-lg">Vendeur</Link>}
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg">Déconnexion</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg">Connexion</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-white gradient-primary rounded-lg text-center">Inscription</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
