import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logStatusChange } from "@/lib/logger";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const { status, deliveryFee, totalPrice, updatedBy } = body;

    // Get current order for status change logging
    const currentOrder = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (deliveryFee !== undefined) updateData.deliveryFee = deliveryFee;
    if (totalPrice !== undefined) updateData.totalPrice = totalPrice;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Log status change if status was updated
    if (status !== undefined && status !== currentOrder.status) {
      await logStatusChange(
        params.id,
        currentOrder.status,
        status,
        updatedBy || 'SYSTEM',
        updatedBy ? 'ADMIN' : 'SYSTEM'
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
