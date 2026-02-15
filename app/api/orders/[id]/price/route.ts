import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logPriceUpdate, logDeliveryFeeUpdate } from '@/lib/logger';

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
    const { negotiatedPrice, deliveryFee, updatedBy, reason } = body;

    if (!updatedBy) {
      return NextResponse.json(
        { error: 'updatedBy é obrigatório' },
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

    const updateData: any = {};
    const priceHistoryArray = currentOrder.priceHistory 
      ? JSON.parse(currentOrder.priceHistory) 
      : [];

    // Handle delivery fee update
    if (deliveryFee !== undefined && deliveryFee !== null) {
      updateData.deliveryFee = deliveryFee;
      
      // Log delivery fee update
      await logDeliveryFeeUpdate(
        id,
        currentOrder.deliveryFee || null,
        deliveryFee,
        updatedBy,
        reason
      );
    }

    // Handle price update
    if (negotiatedPrice !== undefined && negotiatedPrice !== null) {
      // Calculate final negotiated price including delivery fee
      const finalDeliveryFee = deliveryFee !== undefined ? deliveryFee : (currentOrder.deliveryFee || 0);
      const finalNegotiatedPrice = negotiatedPrice;
      
      priceHistoryArray.push({
        oldPrice: currentOrder.negotiatedPrice || currentOrder.originalPrice,
        newPrice: finalNegotiatedPrice,
        deliveryFee: finalDeliveryFee,
        updatedBy,
        updatedAt: new Date().toISOString(),
        reason,
      });

      updateData.negotiatedPrice = finalNegotiatedPrice;
      updateData.totalPrice = finalNegotiatedPrice;
      updateData.priceHistory = JSON.stringify(priceHistoryArray);
      updateData.status = 'NEGOTIATING'; // Mudar status para negociando

      // Registrar alteração de preço no log
      await logPriceUpdate(
        id,
        currentOrder.negotiatedPrice || currentOrder.originalPrice,
        finalNegotiatedPrice,
        updatedBy,
        reason
      );
    } else if (deliveryFee !== undefined) {
      // Se apenas taxa de entrega foi atualizada, recalcular negotiatedPrice
      const basePrice = currentOrder.negotiatedPrice || currentOrder.originalPrice;
      const oldDeliveryFee = currentOrder.deliveryFee || 0;
      const adjustedPrice = basePrice - oldDeliveryFee + deliveryFee;
      
      updateData.negotiatedPrice = adjustedPrice;
      updateData.totalPrice = adjustedPrice;
    }

    // Atualizar pedido
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order price:', error);
    return NextResponse.json(
      { error: 'Falha ao atualizar preço do pedido' },
      { status: 500 }
    );
  }
}
