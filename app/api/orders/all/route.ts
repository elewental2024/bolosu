import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build where clause for filtering
    const where: any = {};

    // Filter by status if provided
    if (status && status !== 'all') {
      where.status = status;
    }

    // Filter by search query (client name, whatsapp, or cpf)
    if (search) {
      const searchTerm = search.toLowerCase();
      where.user = {
        OR: [
          { name: { contains: searchTerm } },
          { whatsapp: { contains: searchTerm } },
          { cpf: { contains: searchTerm } },
        ],
      };
    }

    // Fetch all orders with user details, items, and products
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            whatsapp: true,
            cpf: true,
          },
        },
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
    console.error('Error fetching all orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
