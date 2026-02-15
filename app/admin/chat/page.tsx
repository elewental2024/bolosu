'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  whatsapp: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
}

interface Order {
  id: string;
  user: User;
  messages: Message[];
}

export default function AdminChatListPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/all');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      
      // Filter orders that have messages
      const ordersWithMessages = data.filter((order: Order) => order.messages && order.messages.length > 0);
      setOrders(ordersWithMessages);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'Ontem';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const getLastMessage = (messages: Message[]) => {
    if (messages.length === 0) return null;
    return messages[messages.length - 1];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-primary-700">🎂 Bolos Su Admin</h1>
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/admin/dashboard"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/produtos"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  Produtos
                </Link>
                <Link
                  href="/admin/chat"
                  className="text-primary-600 font-semibold px-3 py-2 rounded-md bg-primary-50"
                >
                  Chat
                </Link>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-md hover:bg-red-50"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Conversas</h2>
          <p className="text-gray-600 mt-1">
            {orders.length} {orders.length === 1 ? 'conversa ativa' : 'conversas ativas'}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma conversa ainda</h3>
            <p className="text-gray-500">
              As conversas aparecerão aqui quando os clientes enviarem mensagens.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
            {orders.map((order) => {
              const lastMessage = getLastMessage(order.messages);
              return (
                <Link
                  key={order.id}
                  href={`/admin/chat/${order.id}`}
                  className="block hover:bg-gray-50 transition-colors"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {order.user.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-semibold text-gray-900 truncate">
                              {order.user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Pedido #{order.id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                        {lastMessage && (
                          <div className="ml-15 mt-2">
                            <p className="text-sm text-gray-600 truncate">
                              {lastMessage.content}
                            </p>
                          </div>
                        )}
                      </div>
                      {lastMessage && (
                        <div className="flex-shrink-0 ml-4">
                          <p className="text-xs text-gray-500">
                            {formatTime(lastMessage.createdAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
