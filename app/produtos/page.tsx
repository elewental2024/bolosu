'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ClientNavbar } from '@/components/layout/ClientNavbar';
import { ProductCard } from '@/components/products/ProductCard';
import { toast, Toaster } from '@/components/ui/toast';
import { Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  instagramUrl: string;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Fetch products
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os produtos',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.productId === product.id);
    let updatedCart: CartItem[];

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch storage event to update navbar
    window.dispatchEvent(new Event('storage'));

    toast({
      title: 'Adicionado ao carrinho! 🎉',
      description: `${product.name} foi adicionado com sucesso`,
      variant: 'success',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-medium">Carregando produtos deliciosos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-50 to-white">
      <ClientNavbar />
      <Toaster />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Nosso Cardápio
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore nossa seleção de bolos artesanais feitos com ingredientes premium e muito amor
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🎂</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhum produto disponível
            </h3>
            <p className="text-gray-600">
              Estamos preparando novidades deliciosas para você!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product)}
                isNew={index < 2}
                isPopular={index === 1 || index === 7}
              />
            ))}
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-2xl shadow-soft">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-bold text-gray-900 mb-2">Qualidade Premium</h3>
            <p className="text-sm text-gray-600">Ingredientes selecionados</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-soft">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-bold text-gray-900 mb-2">Entrega Rápida</h3>
            <p className="text-sm text-gray-600">Fresquinho na sua casa</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-soft">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-bold text-gray-900 mb-2">Suporte Dedicado</h3>
            <p className="text-sm text-gray-600">Chat direto conosco</p>
          </div>
        </div>
      </main>
    </div>
  );
}
