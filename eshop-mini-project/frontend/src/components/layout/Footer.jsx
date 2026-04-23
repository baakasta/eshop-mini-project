import { HiOutlineHeart } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">ES</span>
              </div>
              <span className="text-xl font-bold text-white">E-Shop</span>
            </div>
            <p className="text-sm leading-relaxed max-w-md">Votre destination shopping en ligne. Découvrez des milliers de produits de qualité avec livraison rapide.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Accueil</a></li>
              <li><a href="/products" className="hover:text-white transition-colors">Produits</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>contact@eshop.com</li>
              <li>+216 55 123 456</li>
              <li>Tunis, Tunisie</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2025 E-Shop. Tous droits réservés.</p>
          <p className="text-sm flex items-center gap-1">Fait avec <HiOutlineHeart className="w-4 h-4 text-rose-500" /> en Tunisie</p>
        </div>
      </div>
    </footer>
  );
}
