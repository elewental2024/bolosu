'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPrice, getStatusLabel, getStatusColor } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Order {
  id: string
  status: string
  deliveryAddress: string
  deliveryDate: string
  observations: string | null
  totalPrice: number | null
  deliveryFee: number | null
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      description: string
    }
  }>
  user: {
    id: string
    name: string
    whatsapp: string
  }
  messages: Array<{
    id: string
    content: string
    createdAt: string
    user: {
      id: string
      name: string
      role: string
    }
  }>
  createdAt: string
}

export default function PedidoDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      const data = await response.json()
      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !order) return

    setSendingMessage(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          content: newMessage,
        }),
      })

      if (response.ok) {
        setNewMessage('')
        fetchOrder() // Refresh to get new message
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSendingMessage(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Carregando pedido...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">Pedido não encontrado.</p>
            <Link
              href="/pedidos"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Voltar para Pedidos
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const itemsTotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
  const total = order.totalPrice || itemsTotal + (order.deliveryFee || 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/pedidos"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          ← Voltar para pedidos
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pedido #{order.id.slice(-8)}</CardTitle>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Data do Pedido</p>
                <p className="font-medium">
                  {format(new Date(order.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Data de Entrega</p>
                <p className="font-medium">
                  {format(new Date(order.deliveryDate), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Endereço de Entrega</p>
                <p className="font-medium">{order.deliveryAddress}</p>
              </div>

              {order.observations && (
                <div>
                  <p className="text-sm text-gray-600">Observações</p>
                  <p className="font-medium">{order.observations}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat */}
          <Card>
            <CardHeader>
              <CardTitle>Chat com a Vendedora</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {order.messages.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Nenhuma mensagem ainda. Envie uma mensagem para iniciar a conversa.
                  </p>
                ) : (
                  order.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.user.role === 'admin' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.user.role === 'admin'
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-primary-600 text-white'
                        }`}
                      >
                        <p className="text-sm font-medium mb-1">
                          {message.user.name}
                        </p>
                        <p>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.user.role === 'admin'
                              ? 'text-gray-500'
                              : 'text-primary-100'
                          }`}
                        >
                          {format(new Date(message.createdAt), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={sendMessage} className="flex space-x-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sendingMessage}
                />
                <Button type="submit" disabled={sendingMessage || !newMessage.trim()}>
                  Enviar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between">
                      <span className="font-medium">{item.product.name}</span>
                      <span className="text-gray-600">x{item.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{item.product.description}</span>
                      <span className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(itemsTotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxa de Entrega</span>
                  <span className="font-medium">
                    {order.deliveryFee ? formatPrice(order.deliveryFee) : 'A definir'}
                  </span>
                </div>

                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
