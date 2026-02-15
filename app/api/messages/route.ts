import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { messageSchema } from '@/lib/validations'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId é obrigatório' },
        { status: 400 }
      )
    }

    const messages = await prisma.message.findMany({
      where: { orderId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens' },
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
    const validatedData = messageSchema.parse(body)

    // Check if user has access to this order
    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    if (session.user.role !== 'admin' && order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const message = await prisma.message.create({
      data: {
        orderId: validatedData.orderId,
        userId: session.user.id,
        content: validatedData.content,
      },
      include: {
        user: true,
      },
    })

    return NextResponse.json(message)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao criar mensagem' },
      { status: 400 }
    )
  }
}
