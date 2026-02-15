import { NextRequest, NextResponse } from 'next/server';
import { getOrderLogs } from '@/lib/logger';

/**
 * API para consultar logs de pedidos
 * GET /api/logs?orderId=xxx - Retorna todos os logs de um pedido
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId é obrigatório' },
        { status: 400 }
      );
    }

    const logs = await getOrderLogs(orderId);

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching order logs:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar logs do pedido' },
      { status: 500 }
    );
  }
}
