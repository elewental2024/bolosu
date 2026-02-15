import { prisma } from './prisma';

/**
 * Sistema de logs para compliance legal
 * Registra todas as ações importantes relacionadas aos pedidos
 */

export type LogType = 
  | 'ORDER_CREATED' 
  | 'MESSAGE_SENT' 
  | 'PRICE_UPDATED' 
  | 'STATUS_CHANGED' 
  | 'WHATSAPP_SENT'
  | 'AGREEMENT_CONFIRMED'
  | 'AGREEMENT_REJECTED';

export type LogActor = 'CUSTOMER' | 'ADMIN' | 'SYSTEM';

interface LogMetadata {
  [key: string]: any;
}

/**
 * Cria um log de auditoria para um pedido
 * @param orderId - ID do pedido
 * @param type - Tipo de log
 * @param actor - Quem executou a ação
 * @param content - Descrição da ação
 * @param metadata - Dados adicionais (opcional)
 */
export async function createOrderLog(
  orderId: string,
  type: LogType,
  actor: LogActor,
  content: string,
  metadata?: LogMetadata
) {
  try {
    const log = await prisma.orderLog.create({
      data: {
        orderId,
        type,
        actor,
        content,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
    return log;
  } catch (error) {
    console.error('Error creating order log:', error);
    // Não falhar a operação principal se o log falhar
    // mas registrar o erro para investigação
    throw error;
  }
}

/**
 * Busca logs de um pedido específico
 */
export async function getOrderLogs(orderId: string) {
  try {
    const logs = await prisma.orderLog.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });
    
    return logs.map(log => ({
      ...log,
      metadata: log.metadata ? JSON.parse(log.metadata) : null,
    }));
  } catch (error) {
    console.error('Error fetching order logs:', error);
    throw error;
  }
}

/**
 * Helpers para criar logs específicos
 */

export async function logOrderCreated(
  orderId: string,
  userId: string,
  items: any[],
  totalPrice: number,
  deliveryDate: Date,
  deliveryTime?: string
) {
  return createOrderLog(
    orderId,
    'ORDER_CREATED',
    'CUSTOMER',
    `Pedido criado pelo cliente. Total: R$ ${totalPrice.toFixed(2)}`,
    {
      userId,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
      deliveryDate: deliveryDate.toISOString(),
      deliveryTime,
    }
  );
}

export async function logMessageSent(
  orderId: string,
  userId: string,
  userRole: string,
  content: string
) {
  return createOrderLog(
    orderId,
    'MESSAGE_SENT',
    userRole === 'admin' ? 'ADMIN' : 'CUSTOMER',
    `Mensagem enviada: "${content.substring(0, 100)}${content.length > 100 ? '...' : ''}"`,
    {
      userId,
      userRole,
      messageLength: content.length,
    }
  );
}

export async function logPriceUpdate(
  orderId: string,
  oldPrice: number | null,
  newPrice: number,
  updatedBy: string,
  reason?: string
) {
  return createOrderLog(
    orderId,
    'PRICE_UPDATED',
    'ADMIN',
    `Preço atualizado de R$ ${(oldPrice || 0).toFixed(2)} para R$ ${newPrice.toFixed(2)}${reason ? `. Motivo: ${reason}` : ''}`,
    {
      oldPrice,
      newPrice,
      updatedBy,
      reason,
    }
  );
}

export async function logStatusChange(
  orderId: string,
  oldStatus: string,
  newStatus: string,
  changedBy: string,
  actor: LogActor
) {
  return createOrderLog(
    orderId,
    'STATUS_CHANGED',
    actor,
    `Status alterado de "${oldStatus}" para "${newStatus}"`,
    {
      oldStatus,
      newStatus,
      changedBy,
    }
  );
}

export async function logWhatsAppNotification(
  orderId: string,
  success: boolean,
  phoneNumber: string,
  errorMessage?: string
) {
  return createOrderLog(
    orderId,
    'WHATSAPP_SENT',
    'SYSTEM',
    success 
      ? `Notificação WhatsApp enviada com sucesso para ${phoneNumber}`
      : `Falha ao enviar notificação WhatsApp para ${phoneNumber}: ${errorMessage}`,
    {
      success,
      phoneNumber,
      errorMessage,
    }
  );
}

export async function logAgreement(
  orderId: string,
  agreedBy: LogActor,
  userId: string,
  finalPrice: number
) {
  return createOrderLog(
    orderId,
    'AGREEMENT_CONFIRMED',
    agreedBy,
    `Acordo confirmado. Preço final: R$ ${finalPrice.toFixed(2)}`,
    {
      userId,
      finalPrice,
    }
  );
}
