'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, getStatusLabel, getStatusColor } from '@/lib/utils'

interface Stats {
  totalOrders: number
  pendingOrders: number
  todayOrders: number
  totalRevenue: number
}

interface Order {
  id: string
  status: string
  user: {
    name: string
  }
  items: Array<{
    quantity: number
    price: number
  }>
  deliveryFee: number | null
  totalPrice: number | null
  createdAt: string
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/orders')
      const orders: Order[] = await response.json()

      // Calculate stats
      const today = new Date().toDateString()
      const todayOrders = orders.filter(
        (o) => new Date(o.createdAt).toDateString() === today
      )
      const pendingOrders = orders.filter((o) => o.status === 'pending')

      const totalRevenue = orders
        .filter((o) => o.status === 'delivered')
        .reduce((acc, o) => {
          const itemsTotal = o.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
          return acc + (o.totalPrice || itemsTotal + (o.deliveryFee || 0))
        }, 0)

      setStats({
        totalOrders: orders.length,
        pendingOrders: pendingOrders.length,
        todayOrders: todayOrders.length,
        totalRevenue,
      })

      setRecentOrders(orders.slice(0, 10))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Carregando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary-600">
              {stats.totalOrders}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Pedidos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.pendingOrders}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Pedidos Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {stats.todayOrders}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {formatPrice(stats.totalRevenue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pedidos Recentes</CardTitle>
            <Link
              href="/admin/pedidos"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todos →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhum pedido encontrado.
            </p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const itemsTotal = order.items.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0
                )
                const total = order.totalPrice || itemsTotal + (order.deliveryFee || 0)

                return (
                  <Link
                    key={order.id}
                    href={`/admin/pedidos/${order.id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">
                            Pedido #{order.id.slice(-8)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.user.name}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600">
                          {formatPrice(total)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items.length}{' '}
                          {order.items.length === 1 ? 'item' : 'itens'}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
