'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ClientNavbar } from '@/components/layout/ClientNavbar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, Calendar, MapPin, MessageSquare, Eye } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';

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

const STATUS_LABELS = {
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

  const getTotalItems = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getOrderId = (id: string) => {
    return id.slice(-8).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-medium">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-50 to-white">
      <ClientNavbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Meus Pedidos
          </h1>
          <p className="text-lg text-gray-600">
            Acompanhe o status dos seus pedidos
          </p>
        </div>

        {orders.length === 0 ? (
          <Card className="max-w-lg mx-auto text-center border-none shadow-soft">
            <CardContent className="p-12">
              <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Nenhum pedido ainda
              </h2>
              <p className="text-gray-600 mb-6">
                Você ainda não fez nenhum pedido. Que tal começar agora?
              </p>
              <Link href="/produtos">
                <Button size="lg">
                  Ver Produtos
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="border-none shadow-soft hover:shadow-medium transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          Pedido #{getOrderId(order.id)}
                        </h3>
                        <Badge variant={order.status as any}>
                          {STATUS_LABELS[order.status as keyof typeof STATUS_LABELS] ||
                            order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Criado em: {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <Calendar className="h-5 w-5" />
                      <div>
                        <p className="text-xs text-gray-600">Entrega prevista:</p>
                        <p className="text-sm font-semibold">
                          {formatDateTime(order.deliveryDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total de itens</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {getTotalItems(order.items)} {getTotalItems(order.items) === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                    {order.totalPrice && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Valor total</p>
                        <p className="text-lg font-semibold text-primary">
                          {formatCurrency(order.totalPrice)}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Endereço
                      </p>
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {order.deliveryAddress}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-3 font-semibold">Itens do pedido:</p>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center text-sm p-2 bg-white rounded-lg"
                        >
                          <span className="text-gray-700">
                            {item.product.name} × {item.quantity}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link href={`/chat/${order.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Chat
                      </Button>
                    </Link>
                    <Link href={`/pedidos/${order.id}`}>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Ver detalhes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
