import { z } from 'zod'
import { validateCPF } from './utils'

export const loginSchema = z.object({
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
})

export const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
})

export const productSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  price: z.number().positive('Preço deve ser positivo'),
  instagramUrl: z.string().url('URL do Instagram inválida'),
  active: z.boolean().optional(),
})

export const orderSchema = z.object({
  deliveryAddress: z.string().min(10, 'Endereço deve ter pelo menos 10 caracteres'),
  deliveryDate: z.string().min(1, 'Data de entrega é obrigatória'),
  observations: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive('Quantidade deve ser positiva'),
    price: z.number().positive('Preço deve ser positivo'),
  })).min(1, 'Adicione pelo menos um produto'),
})

export const messageSchema = z.object({
  orderId: z.string(),
  content: z.string().min(1, 'Mensagem não pode estar vazia'),
})
