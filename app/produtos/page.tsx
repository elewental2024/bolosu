'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string | null
  active: boolean
}

interface CartItem {
  productId: string
  quantity: number
  price: number
  product: Product
}

export default function ProdutosPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.productId === product.id)

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          quantity: 1,
          price: product.price,
          product,
        },
      ])
    }
  }

  const removeFromCart = (productId: string) => {
    const existingItem = cart.find((item) => item.productId === productId)

    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      )
    } else {
      setCart(cart.filter((item) => item.productId !== productId))
    }
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleCheckout = () => {
    // Store cart in sessionStorage and navigate to checkout
    sessionStorage.setItem('cart', JSON.stringify(cart))
    router.push('/pedidos/novo')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Carregando produtos...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nossos Bolos</h1>
        <p className="mt-2 text-gray-600">
          Escolha seus bolos favoritos e faça seu pedido
        </p>
      </div>

      {/* Cart summary */}
      {cart.length > 0 && (
        <div className="mb-6 bg-primary-50 border-2 border-primary-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-primary-900">
                Carrinho ({cart.reduce((acc, item) => acc + item.quantity, 0)}{' '}
                {cart.reduce((acc, item) => acc + item.quantity, 0) === 1
                  ? 'item'
                  : 'itens'}
                )
              </h3>
              <p className="text-lg font-bold text-primary-700">
                Total: {formatPrice(getCartTotal())}
              </p>
            </div>
            <Button onClick={handleCheckout}>Fazer Pedido</Button>
          </div>
          <div className="mt-4 space-y-2">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between text-sm"
              >
                <span>
                  {item.quantity}x {item.product.name}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    −
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const cartItem = cart.find((item) => item.productId === product.id)
          const quantity = cartItem?.quantity || 0

          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {product.imageUrl && (
                <div className="aspect-square bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                <CardDescription className="mb-4">
                  {product.description}
                </CardDescription>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-primary-600">
                    {formatPrice(product.price)}
                  </p>
                  <div className="flex items-center space-x-2">
                    {quantity > 0 && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => removeFromCart(product.id)}
                        >
                          −
                        </Button>
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
                          {quantity}
                        </span>
                      </>
                    )}
                    <Button size="sm" onClick={() => addToCart(product)}>
                      {quantity > 0 ? '+' : 'Adicionar'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Nenhum produto disponível no momento.
          </p>
        </div>
      )}
    </div>
  )
}
