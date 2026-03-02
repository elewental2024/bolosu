import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logOrderCreated } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, deliveryAddress, deliveryDate, deliveryTime, observations, items, totalPrice } = body;

    // Validate required fields
    if (!userId || !deliveryAddress || !deliveryDate || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validar que a data não é no passado
    const deliveryDateObj = new Date(deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deliveryDateObj < today) {
      return NextResponse.json(
        { error: 'Data de entrega não pode ser no passado' },
        { status: 400 }
      );
    }

    // Create order with items - status PENDING para negociação
    const order = await prisma.order.create({
      data: {
        userId,
        deliveryAddress,
        deliveryDate: deliveryDateObj,
        deliveryTime,
        observations,
        totalPrice,
        originalPrice: totalPrice, // Salvar preço original
        status: 'PENDING', // Status inicial: aguardando negociação
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    // Registrar criação do pedido no log (compliance legal)
    await logOrderCreated(
      order.id,
      userId,
      items,
      totalPrice,
      deliveryDateObj,
      deliveryTime
    );

    // Tentar enviar notificação WhatsApp para o admin
    try {
      const whatsappResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/whatsapp/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          customerName: order.user.name,
          items: order.items.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
          })),
          deliveryDate: deliveryDateObj.toISOString(),
          deliveryTime,
          observations,
        }),
      });

      if (!whatsappResponse.ok) {
        console.warn('Failed to send WhatsApp notification, but order was created');
      }
    } catch (whatsappError) {
      console.error('Error sending WhatsApp notification:', whatsappError);
      // Não falhar a criação do pedido se WhatsApp falhar
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
