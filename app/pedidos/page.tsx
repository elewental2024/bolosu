'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
  };
}

interface Order {
  id: string;
  status: string;
  deliveryAddress: string;
  deliveryDate: string;
  observations: string | null;
  totalPrice: number | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  whatsapp: string;
  cpf: string;
  role: string;
}

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  NEGOTIATING: 'bg-blue-100 text-blue-800',
  AWAITING_PAYMENT: 'bg-purple-100 text-purple-800',
  PAID: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
  // Legacy statuses for backwards compatibility
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_LABELS = {
  PENDING: 'Aguardando Negociação',
  NEGOTIATING: 'Em Negociação',
  AWAITING_PAYMENT: 'Aguardando Pagamento',
  PAID: 'Pago',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
  // Legacy labels
  pending: 'Pendente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Pronto',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Fetch orders
    fetchOrders(parsedUser.id);
  }, [router]);

  const fetchOrders = async (userId: string) => {
    try {
      const response = await fetch(`/api/orders?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    router.push('/login');
  };

  const goToProducts = () => {
    router.push('/produtos');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getTotalItems = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getOrderId = (id: string) => {
    return id.slice(-8).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-pink-600 font-medium">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-pink-600">🎂 Bolos Su</div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={goToProducts}
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                🛍️ Produtos
              </button>
              <button
                onClick={handleLogout}
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Meus Pedidos</h1>
          <p className="text-gray-600">
            Acompanhe o status dos seus pedidos
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Nenhum pedido ainda
            </h2>
            <p className="text-gray-600 mb-6">
              Você ainda não fez nenhum pedido. Que tal começar agora?
            </p>
            <button
              onClick={goToProducts}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Ver Produtos
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          Pedido #{getOrderId(order.id)}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            STATUS_COLORS[order.status as keyof typeof STATUS_COLORS] ||
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {STATUS_LABELS[order.status as keyof typeof STATUS_LABELS] ||
                            order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Criado em: {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">
                        Entrega prevista:
                      </p>
                      <p className="text-lg font-semibold text-pink-600">
                        {formatDate(order.deliveryDate)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total de itens</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {getTotalItems(order.items)} {getTotalItems(order.items) === 1 ? 'item' : 'itens'}
                        </p>
                      </div>
                      {order.totalPrice && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Valor total</p>
                          <p className="text-lg font-semibold text-pink-600">
                            {formatPrice(order.totalPrice)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Endereço</p>
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">
                          {order.deliveryAddress}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2 font-semibold">Itens do pedido:</p>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <p key={item.id} className="text-sm text-gray-700">
                            • {item.product.name} - {item.quantity}x ({formatPrice(item.price)})
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Link
                        href={`/chat/${order.id}`}
                        className="text-pink-600 hover:text-pink-700 font-medium text-sm"
                      >
                        💬 Chat
                      </Link>
                      <Link
                        href={`/pedidos/${order.id}`}
                        className="text-pink-600 hover:text-pink-700 font-medium text-sm"
                      >
                        Ver detalhes →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
