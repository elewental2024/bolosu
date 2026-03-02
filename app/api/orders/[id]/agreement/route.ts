import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAgreement, logStatusChange } from '@/lib/logger';

/**
 * API para confirmar acordo em um pedido
 * POST /api/orders/[id]/agreement
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { userId, userRole } = body; // "customer" ou "admin"

    if (!userId || !userRole) {
      return NextResponse.json(
        { error: 'userId e userRole são obrigatórios' },
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

    // Determinar qual flag atualizar
    const isAdmin = userRole === 'admin';
    
    interface OrderUpdateData {
      agreedByAdmin?: boolean;
      agreedByCustomer?: boolean;
      agreedAt?: Date;
      status?: string;
    }
    
    const updateData: OrderUpdateData = {
      [isAdmin ? 'agreedByAdmin' : 'agreedByCustomer']: true,
    };

    // Se ambos concordaram, marcar data do acordo e mudar status
    const bothAgreed = isAdmin 
      ? currentOrder.agreedByCustomer 
      : currentOrder.agreedByAdmin;

    if (bothAgreed) {
      updateData.agreedAt = new Date();
      updateData.status = 'AWAITING_PAYMENT';
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

    // Registrar acordo no log
    await logAgreement(
      id,
      isAdmin ? 'ADMIN' : 'CUSTOMER',
      userId,
      updatedOrder.negotiatedPrice || updatedOrder.originalPrice
    );

    // Se ambos concordaram, registrar mudança de status
    if (bothAgreed) {
      await logStatusChange(
        id,
        currentOrder.status,
        'AWAITING_PAYMENT',
        userId,
        'SYSTEM'
      );
    }

    return NextResponse.json({
      order: updatedOrder,
      bothAgreed: bothAgreed && updateData.agreedAt,
    });
  } catch (error) {
    console.error('Error confirming agreement:', error);
    return NextResponse.json(
      { error: 'Falha ao confirmar acordo' },
      { status: 500 }
    );
  }
}
