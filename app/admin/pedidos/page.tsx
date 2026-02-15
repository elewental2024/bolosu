'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatPrice, getStatusLabel, getStatusColor } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Order {
  id: string
  status: string
  deliveryAddress: string
  deliveryDate: string
  user: {
    id: string
    name: string
    whatsapp: string
    cpf: string
  }
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      name: string
    }
  }>
  deliveryFee: number | null
  totalPrice: number | null
  createdAt: string
}

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'preparing', label: 'Em Preparo' },
  { value: 'ready', label: 'Pronto para Entrega' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'cancelled', label: 'Cancelado' },
]

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

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

  const filterOrders = () => {
    let filtered = orders

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.user.name.toLowerCase().includes(search) ||
          order.user.whatsapp.includes(search) ||
          order.user.cpf.includes(search) ||
          order.id.toLowerCase().includes(search)
      )
    }

    setFilteredOrders(filtered)
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Pedidos</h1>
        <p className="mt-2 text-gray-600">
          {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido' : 'pedidos'}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Buscar por cliente, WhatsApp, CPF ou ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex space-x-2 overflow-x-auto">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={statusFilter === option.value ? 'primary' : 'ghost'}
              onClick={() => setStatusFilter(option.value)}
              className="whitespace-nowrap"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Nenhum pedido encontrado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Link key={order.id} href={`/admin/pedidos/${order.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          Pedido #{order.id.slice(-8)}
                        </h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Cliente:</span>{' '}
                          {order.user.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">WhatsApp:</span>{' '}
                          {order.user.whatsapp}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Criado:</span>{' '}
                          {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Entrega:</span>{' '}
                          {format(new Date(order.deliveryDate), "dd/MM/yyyy 'às' HH:mm")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-primary-600">
                        {formatPrice(calculateOrderTotal(order))}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.items.length}{' '}
                        {order.items.length === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
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
