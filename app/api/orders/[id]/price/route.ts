import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logPriceUpdate } from '@/lib/logger';

/**
 * API para atualizar o preço negociado de um pedido
 * PUT /api/orders/[id]/price
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { negotiatedPrice, updatedBy, reason } = body;

    if (!negotiatedPrice || !updatedBy) {
      return NextResponse.json(
        { error: 'negotiatedPrice e updatedBy são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar pedido atual
    const currentOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar histórico de preços
    const priceHistoryArray = currentOrder.priceHistory 
      ? JSON.parse(currentOrder.priceHistory) 
      : [];
    
    priceHistoryArray.push({
      oldPrice: currentOrder.negotiatedPrice || currentOrder.originalPrice,
      newPrice: negotiatedPrice,
      updatedBy,
      updatedAt: new Date().toISOString(),
      reason,
    });

    // Atualizar pedido
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        negotiatedPrice,
        totalPrice: negotiatedPrice,
        priceHistory: JSON.stringify(priceHistoryArray),
        status: 'NEGOTIATING', // Mudar status para negociando
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

    // Registrar alteração de preço no log
    await logPriceUpdate(
      id,
      currentOrder.negotiatedPrice || currentOrder.originalPrice,
      negotiatedPrice,
      updatedBy,
      reason
    );

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order price:', error);
    return NextResponse.json(
      { error: 'Falha ao atualizar preço do pedido' },
      { status: 500 }
    );
  }
}
