'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, getStatusLabel, getStatusColor } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Order {
  id: string
  status: string
  deliveryAddress: string
  deliveryDate: string
  totalPrice: number | null
  deliveryFee: number | null
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
    }
  }>
  createdAt: string
}

export default function PedidosPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateOrderTotal = (order: Order) => {
    if (order.totalPrice) return order.totalPrice
    const itemsTotal = order.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )
    return itemsTotal + (order.deliveryFee || 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Carregando pedidos...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>
          <p className="mt-2 text-gray-600">
            Acompanhe o status dos seus pedidos
          </p>
        </div>
        <Link
          href="/produtos"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Novo Pedido
        </Link>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">
              Você ainda não fez nenhum pedido.
            </p>
            <Link
              href="/produtos"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Ver Produtos
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/pedidos/${order.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          Pedido #{order.id.slice(-8)}
                        </h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Criado em{' '}
                        {format(new Date(order.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">
                        {formatPrice(calculateOrderTotal(order))}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Entrega:</span>{' '}
                      {format(new Date(order.deliveryDate), "dd/MM/yyyy 'às' HH:mm")}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Endereço:</span>{' '}
                      {order.deliveryAddress}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <span
                          key={item.id}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {item.quantity}x {item.product.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
