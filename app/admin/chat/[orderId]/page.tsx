'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  role: string;
  whatsapp?: string;
  cpf?: string;
}

interface Message {
  id: string;
  orderId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: User;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

interface Order {
  id: string;
  status: string;
  deliveryAddress: string;
  deliveryDate: string;
  observations?: string;
  originalPrice: number;
  negotiatedPrice?: number;
  priceHistory?: string;
  agreedByCustomer: boolean;
  agreedByAdmin: boolean;
  agreedAt?: string;
  totalPrice?: number;
  items: OrderItem[];
  user: User;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pendente',
  NEGOTIATING: 'Negociando',
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

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  NEGOTIATING: 'bg-blue-100 text-blue-800',
  AWAITING_PAYMENT: 'bg-orange-100 text-orange-800',
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

export default function AdminChatDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [priceReason, setPriceReason] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userStr);
    if (parsedUser.role !== 'admin') {
      router.push('/login');
      return;
    }

    setUser(parsedUser);
    fetchOrder();
    fetchMessages();

    const interval = setInterval(() => {
      fetchOrder();
      fetchMessages();
    }, 3000);
    setPollingInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [orderId, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?orderId=${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          userId: user.id,
          content: newMessage.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setNewMessage('');
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !order || !newPrice) return;
    
    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Por favor, insira um preço válido.');
      return;
    }
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/price`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          negotiatedPrice: priceValue,
          updatedBy: user.id,
          reason: priceReason || 'Atualização de preço',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update price');
      }

      await fetchOrder();
      setNewPrice('');
      setPriceReason('');
      alert('Preço atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Erro ao atualizar preço. Tente novamente.');
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmAgreement = async () => {
    if (!user || !order) return;
    
    setConfirming(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/agreement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userRole: 'admin',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm agreement');
      }

      await fetchOrder();
      alert('Acordo confirmado com sucesso!');
    } catch (error) {
      console.error('Error confirming agreement:', error);
      alert('Erro ao confirmar acordo. Tente novamente.');
    } finally {
      setConfirming(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Order Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Detalhes do Pedido</h2>
              
              {order && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">ID do Pedido</p>
                    <p className="font-mono text-sm text-gray-900">{order.id.slice(-12)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[order.status]
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Preços</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Original:</span>
                        <span className="text-sm font-medium">{formatCurrency(order.originalPrice)}</span>
                      </div>
                      {order.negotiatedPrice && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Negociado:</span>
                          <span className="text-sm font-bold text-primary-600">{formatCurrency(order.negotiatedPrice)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm font-semibold text-gray-900">Atual:</span>
                        <span className="text-lg font-bold text-primary-600">
                          {formatCurrency(order.negotiatedPrice || order.originalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {order.priceHistory && JSON.parse(order.priceHistory).length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Histórico de Preços</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {JSON.parse(order.priceHistory).map((entry: any, index: number) => (
                          <div key={index} className="text-xs bg-gray-50 rounded p-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500 line-through">{formatCurrency(entry.oldPrice)}</span>
                              <span className="font-medium text-primary-600">{formatCurrency(entry.newPrice)}</span>
                            </div>
                            {entry.reason && (
                              <p className="text-gray-600 mt-1">{entry.reason}</p>
                            )}
                            <p className="text-gray-400 mt-1">
                              {new Date(entry.updatedAt).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-600 mb-3">Atualizar Preço</p>
                    <form onSubmit={handleUpdatePrice} className="space-y-2">
                      <div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          placeholder="Novo preço (R$)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          disabled={updating}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={priceReason}
                          onChange={(e) => setPriceReason(e.target.value)}
                          placeholder="Motivo (opcional)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          disabled={updating}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={updating || !newPrice}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {updating ? 'Atualizando...' : '💰 Atualizar Preço'}
                      </button>
                    </form>
                  </div>

                  {order.negotiatedPrice && !order.agreedByAdmin && (
                    <div className="border-t pt-4">
                      <button
                        onClick={handleConfirmAgreement}
                        disabled={confirming}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {confirming ? 'Confirmando...' : '✓ Confirmar Acordo'}
                      </button>
                    </div>
                  )}

                  {order.agreedByCustomer && order.agreedByAdmin && order.agreedAt && (
                    <div className="border-t pt-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-green-800 mb-1">✓ Acordo Confirmado</p>
                        <p className="text-xs text-green-600">
                          Acordo fechado em {new Date(order.agreedAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  )}

                  {!order.agreedByCustomer && order.agreedByAdmin && (
                    <div className="border-t pt-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-blue-800 mb-1">⏳ Aguardando Cliente</p>
                        <p className="text-xs text-blue-600">Você confirmou o acordo. Aguardando aceitação do cliente.</p>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Cliente</p>
                    <p className="font-medium text-gray-900">{order.user.name}</p>
                    <p className="text-sm text-gray-600">{order.user.whatsapp}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">Endereço de Entrega</p>
                    <p className="text-sm text-gray-900 mt-1">{order.deliveryAddress}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Data de Entrega</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(order.deliveryDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  {order.observations && (
                    <div>
                      <p className="text-sm text-gray-600">Observações</p>
                      <p className="text-sm text-gray-900 mt-1">{order.observations}</p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Itens</p>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="text-sm">
                          <p className="text-gray-900">
                            {item.quantity}x {item.product.name}
                          </p>
                          <p className="text-gray-600">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.totalPrice && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-900">Total</p>
                        <p className="text-lg font-bold text-primary-600">
                          {formatCurrency(order.totalPrice)}
                        </p>
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/admin/pedidos/${order.id}`}
                    className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mt-4"
                  >
                    Ver Pedido Completo
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-2 flex flex-col bg-white rounded-lg shadow-sm" style={{ height: 'calc(100vh - 180px)' }}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Chat</h2>
                  {order && (
                    <p className="text-sm text-gray-600">Conversa com {order.user.name}</p>
                  )}
                </div>
                <Link
                  href="/admin/chat"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  ← Voltar
                </Link>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-gray-600">Nenhuma mensagem ainda</p>
                  <p className="text-sm text-gray-500 mt-2">Envie uma mensagem para começar a conversa</p>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => {
                    const isOwnMessage = user && message.userId === user.id;
                    const showDate = index === 0 || 
                      formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt);

                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                              {formatDate(message.createdAt)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs md:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`rounded-lg px-4 py-2 ${
                                isOwnMessage
                                  ? 'bg-primary-500 text-white rounded-br-none'
                                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
                              }`}
                            >
                              {!isOwnMessage && (
                                <p className="text-xs font-semibold mb-1 text-gray-600">
                                  {message.user.name}
                                </p>
                              )}
                              <p className="break-words">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isOwnMessage ? 'text-primary-100' : 'text-gray-500'
                                }`}
                              >
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {sending ? '...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
