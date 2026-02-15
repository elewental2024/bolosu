'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getStatusLabel, getStatusColor } from '@/lib/utils'
import { format } from 'date-fns'

interface Order {
  id: string
  status: string
  user: {
    name: string
  }
  messages: Array<{
    id: string
    content: string
    createdAt: string
  }>
  createdAt: string
}

export default function AdminChatsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data: Order[] = await response.json()
      // Filter orders that have messages
      const ordersWithMessages = data.filter((order) => order.messages.length > 0)
      setOrders(ordersWithMessages)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Carregando conversas...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Conversas com Clientes</h1>
        <p className="mt-2 text-gray-600">
          {orders.length} {orders.length === 1 ? 'conversa ativa' : 'conversas ativas'}
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Nenhuma conversa ativa no momento.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => {
            const lastMessage = order.messages[order.messages.length - 1]

            return (
              <Link key={order.id} href={`/admin/pedidos/${order.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {order.user.name}
                      </CardTitle>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Pedido #{order.id.slice(-8)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {lastMessage.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {format(new Date(lastMessage.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.messages.length}{' '}
                        {order.messages.length === 1 ? 'mensagem' : 'mensagens'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
