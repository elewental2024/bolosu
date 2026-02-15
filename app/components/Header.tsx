'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  role: string;
}

export default function FixedHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Get cart count
    const cart = localStorage.getItem('cart');
    if (cart) {
      const parsedCart = JSON.parse(cart);
      const count = parsedCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    }

    // Listen for cart changes
    const handleStorageChange = () => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const parsedCart = JSON.parse(cart);
        const count = parsedCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    setUser(null);
    setCartCount(0);
    router.push('/login');
  };

  const goToHome = () => {
    if (user) {
      router.push(user.role === 'admin' ? '/admin/dashboard' : '/produtos');
    } else {
      router.push('/');
    }
  };

  const goToProducts = () => {
    router.push('/produtos');
  };

  const goToOrders = () => {
    router.push('/pedidos');
  };

  const goToCart = () => {
    router.push('/pedidos/novo');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border-b border-pink-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={goToHome}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-3xl">🎂</span>
            <span className="text-2xl font-bold text-pink-600">Bolos Su</span>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={goToHome}
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
            >
              Home
            </button>
            {user && (
              <>
                <button
                  onClick={goToProducts}
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                >
                  Produtos
                </button>
                <button
                  onClick={goToOrders}
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                >
                  Pedidos
                </button>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Cart Icon */}
                <button
                  onClick={goToCart}
                  className="relative p-2 text-gray-700 hover:text-pink-600 transition-colors"
                >
                  <span className="text-2xl">🛒</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 hidden md:block">
                    Olá, {user.name.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
