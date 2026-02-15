'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, Package, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  whatsapp: string;
  cpf: string;
  role: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

interface Order {
  id: string;
  userId: string;
  user: User;
  status: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime?: string;
  observations?: string;
  deliveryFee?: number;
  originalPrice: number;
  negotiatedPrice?: number;
  priceHistory?: string;
  totalPrice?: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  NEGOTIATING: 'bg-blue-100 text-blue-800',
  AWAITING_PAYMENT: 'bg-purple-100 text-purple-800',
  PAID: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Aguardando Negociação',
  NEGOTIATING: 'Em Negociação',
  AWAITING_PAYMENT: 'Aguardando Pagamento',
  PAID: 'Pago',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
  pending: 'Pendente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Pronto',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const STATUS_TIMELINE: Record<string, number> = {
  PENDING: 0,
  NEGOTIATING: 1,
  AWAITING_PAYMENT: 2,
  PAID: 3,
  COMPLETED: 4,
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchOrder(parsedUser.id);
  }, [router, orderId]);

  const fetchOrder = async (userId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/pedidos');
        }
        throw new Error('Failed to fetch order');
      }
      const data = await response.json();

      // Verify permission: client can only see their own orders
      if (data.userId !== userId) {
        alert('Você não tem permissão para ver este pedido');
        router.push('/pedidos');
        return;
      }

      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Erro ao carregar pedido');
      router.push('/pedidos');
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

  const formatDateOnly = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getOrderId = (id: string) => {
    return id.slice(-8).toUpperCase();
  };

  const calculateProductsTotal = () => {
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTimelineProgress = (status: string) => {
    return STATUS_TIMELINE[status] ?? 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-pink-600 font-medium">Carregando pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido não encontrado</h2>
          <Link
            href="/pedidos"
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            ← Voltar para meus pedidos
          </Link>
        </div>
      </div>
    );
  }

  const currentProgress = getTimelineProgress(order.status);
  const productsTotal = calculateProductsTotal();

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
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link
            href="/pedidos"
            className="text-pink-600 hover:text-pink-700 font-medium mb-4 inline-block"
          >
            ← Voltar para meus pedidos
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Pedido #{getOrderId(order.id)}</h1>
              <p className="text-gray-600 mt-1">Criado em {formatDate(order.createdAt)}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {STATUS_LABELS[order.status] || order.status}
            </span>
          </div>
        </div>

        {/* Timeline Visual */}
        {order.status in STATUS_TIMELINE && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Status do Pedido</h2>
            <div className="relative">
              <div className="flex items-center justify-between relative">
                {['Pendente', 'Negociando', 'Aguard. Pag.', 'Pago', 'Concluído'].map(
                  (step, index) => (
                    <div key={index} className="flex flex-col items-center z-10 relative flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index <= currentProgress
                            ? 'bg-pink-600 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {index < currentProgress ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      <p
                        className={`text-xs mt-2 text-center ${
                          index <= currentProgress ? 'text-pink-600 font-semibold' : 'text-gray-400'
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  )
                )}
              </div>
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200" style={{ zIndex: 0 }}>
                <div
                  className="h-full bg-pink-600 transition-all duration-300"
                  style={{ width: `${(currentProgress / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Delivery Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Informações de Entrega</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">Endereço</p>
                <p className="font-medium text-gray-800">{order.deliveryAddress}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">Data de Entrega</p>
                <p className="font-medium text-gray-800">{formatDateOnly(order.deliveryDate)}</p>
              </div>
            </div>
            {order.deliveryTime && (
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Horário</p>
                  <p className="font-medium text-gray-800">{order.deliveryTime}</p>
                </div>
              </div>
            )}
            {order.observations && (
              <div className="flex items-start space-x-3">
                <Package className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Observações</p>
                  <p className="font-medium text-gray-800">{order.observations}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🎂 Itens do Pedido</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🍰</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-pink-600">{formatPrice(item.price * item.quantity)}</p>
                  <p className="text-sm text-gray-600">{formatPrice(item.price)} cada</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">💰 Valores</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Produtos</span>
              <span className="font-medium text-gray-800">{formatPrice(productsTotal)}</span>
            </div>
            {order.deliveryFee && order.deliveryFee > 0 && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Taxa de Entrega</span>
                <span className="font-medium text-gray-800">{formatPrice(order.deliveryFee)}</span>
              </div>
            )}
            {order.negotiatedPrice && order.negotiatedPrice !== order.originalPrice && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Ajuste de Negociação</span>
                <span className="font-medium text-gray-800">
                  {formatPrice(order.negotiatedPrice - productsTotal - (order.deliveryFee || 0))}
                </span>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-pink-600">
                  {formatPrice(order.negotiatedPrice || order.totalPrice || productsTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Price History */}
          {order.priceHistory && JSON.parse(order.priceHistory).length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-800 mb-3">Histórico de Alterações</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {JSON.parse(order.priceHistory).map((entry: any, index: number) => (
                  <div key={index} className="text-sm bg-gray-50 rounded p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-500 line-through">{formatPrice(entry.oldPrice)}</span>
                      <span className="font-bold text-pink-600">{formatPrice(entry.newPrice)}</span>
                    </div>
                    {entry.reason && (
                      <p className="text-gray-600 text-xs mt-1">{entry.reason}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      {formatDate(entry.updatedAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Large Chat Button */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Link
            href={`/chat/${order.id}`}
            className="flex items-center justify-center space-x-3 bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
            <span>💬 Abrir Chat</span>
          </Link>
          <p className="text-center text-sm text-gray-600 mt-3">
            Converse com a equipe sobre seu pedido
          </p>
        </div>
      </main>
    </div>
  );
}
