import { prisma } from './prisma'
import { validateCPF } from './utils'

export interface AuthUser {
  id: string
  name: string
  whatsapp: string
  cpf: string
  role: string
}

export async function loginUser(whatsapp: string, cpf: string): Promise<AuthUser | null> {
  const cleanWhatsapp = whatsapp.replace(/\D/g, '')
  const cleanCPF = cpf.replace(/\D/g, '')
  
  if (!validateCPF(cleanCPF)) {
    return null
  }
  
  const user = await prisma.user.findFirst({
    where: {
      whatsapp: cleanWhatsapp,
      cpf: cleanCPF
    }
  })
  
  if (!user) {
    return null
  }
  
  return {
    id: user.id,
    name: user.name,
    whatsapp: user.whatsapp,
    cpf: user.cpf,
    role: user.role
  }
}

export async function registerUser(
  name: string,
  whatsapp: string,
  cpf: string
): Promise<AuthUser | null> {
  const cleanWhatsapp = whatsapp.replace(/\D/g, '')
  const cleanCPF = cpf.replace(/\D/g, '')
  
  if (!validateCPF(cleanCPF)) {
    throw new Error('CPF inválido')
  }
  
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { whatsapp: cleanWhatsapp },
        { cpf: cleanCPF }
      ]
    }
  })
  
  if (existingUser) {
    throw new Error('Usuário já existe com este WhatsApp ou CPF')
  }
  
  const user = await prisma.user.create({
    data: {
      name,
      whatsapp: cleanWhatsapp,
      cpf: cleanCPF,
      role: 'client'
    }
  })
  
  return {
    id: user.id,
    name: user.name,
    whatsapp: user.whatsapp,
    cpf: user.cpf,
    role: user.role
  }
}
