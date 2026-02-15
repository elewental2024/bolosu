import { NextRequest, NextResponse } from 'next/server';
import { logWhatsAppNotification } from '@/lib/logger';

/**
 * API para enviar notificações WhatsApp usando WhatsApp Business Cloud API
 * POST /api/whatsapp/notify
 * Body: { orderId, customerName, items, deliveryDate, deliveryTime, observations }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, customerName, items, deliveryDate, deliveryTime, observations, chatUrl } = body;

    if (!orderId || !customerName) {
      return NextResponse.json(
        { error: 'orderId e customerName são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se as credenciais do WhatsApp estão configuradas
    const whatsappToken = process.env.WHATSAPP_TOKEN;
    const whatsappPhoneId = process.env.WHATSAPP_PHONE_ID;
    const adminWhatsApp = process.env.ADMIN_WHATSAPP;

    if (!whatsappToken || !whatsappPhoneId || !adminWhatsApp) {
      console.warn('WhatsApp credentials not configured. Notification skipped.');
      
      // Registrar tentativa falha no log
      await logWhatsAppNotification(
        orderId,
        false,
        adminWhatsApp || 'N/A',
        'Credenciais do WhatsApp não configuradas'
      );

      return NextResponse.json({
        success: false,
        message: 'WhatsApp credentials not configured',
        fallback: true,
      });
    }

    // Formatar a mensagem
    const itemsList = items.map((item: any) => 
      `• ${item.name} - ${item.quantity}x - R$ ${item.price.toFixed(2)}`
    ).join('\n');

    const message = `
🎂 *Novo Chamado de Pedido!*

👤 *Cliente:* ${customerName}
📋 *Pedido:* #${orderId.slice(-8).toUpperCase()}

*Itens do Pedido:*
${itemsList}

📅 *Data de Entrega:* ${new Date(deliveryDate).toLocaleDateString('pt-BR')}
⏰ *Horário:* ${deliveryTime || 'Não especificado'}

${observations ? `📝 *Observações:* ${observations}\n` : ''}
💬 *Link do Chat:* ${chatUrl || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/chat/${orderId}`}

_Acesse o painel admin para negociar e confirmar o pedido._
    `.trim();

    // Enviar para WhatsApp Business API
    const whatsappApiUrl = `https://graph.facebook.com/v17.0/${whatsappPhoneId}/messages`;
    
    const response = await fetch(whatsappApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: adminWhatsApp,
        type: 'text',
        text: {
          body: message,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('WhatsApp API error:', errorData);

      // Registrar falha no log
      await logWhatsAppNotification(
        orderId,
        false,
        adminWhatsApp,
        `API error: ${response.status} - ${JSON.stringify(errorData)}`
      );

      return NextResponse.json({
        success: false,
        message: 'Failed to send WhatsApp notification',
        error: errorData,
        fallback: true,
      }, { status: response.status });
    }

    const data = await response.json();

    // Registrar sucesso no log
    await logWhatsAppNotification(
      orderId,
      true,
      adminWhatsApp,
      undefined
    );

    return NextResponse.json({
      success: true,
      message: 'WhatsApp notification sent successfully',
      data,
    });

  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    
    // Tentar registrar erro no log se temos orderId
    try {
      const body = await request.json();
      if (body.orderId) {
        await logWhatsAppNotification(
          body.orderId,
          false,
          process.env.ADMIN_WHATSAPP || 'N/A',
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    } catch (logError) {
      console.error('Error logging WhatsApp failure:', logError);
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to send WhatsApp notification',
        fallback: true,
      },
      { status: 500 }
    );
  }
}
