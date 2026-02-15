import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { orderSchema } from '@/lib/validations'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where: any = session.user.role === 'admin' 
      ? {} 
      : { userId: session.user.id }

    if (status) {
      where.status = status
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = orderSchema.parse(body)

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        deliveryAddress: validatedData.deliveryAddress,
        deliveryDate: new Date(validatedData.deliveryDate),
        observations: validatedData.observations,
        items: {
          create: validatedData.items,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(order)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao criar pedido' },
      { status: 400 }
    )
  }
}
