import { prisma } from './prisma'
import { validateCPF } from './utils'
import bcrypt from 'bcryptjs'

export interface AuthUser {
  id: string
  name: string
  whatsapp: string
  cpf: string
  role: string
}

export async function loginUser(whatsapp: string, cpf: string, pin?: string): Promise<AuthUser | null> {
  const cleanWhatsapp = whatsapp.replace(/\D/g, '')
  const cleanCPF = cpf.replace(/\D/g, '')
  
  console.log('Cleaned credentials:', { cleanWhatsapp, cleanCPF })
  console.log('CPF valid?', validateCPF(cleanCPF))
  
  if (!validateCPF(cleanCPF)) {
    console.log('CPF validation failed')
    return null
  }
  
  const user = await prisma.user.findFirst({
    where: {
      whatsapp: cleanWhatsapp,
      cpf: cleanCPF
    }
  })
  
  console.log('User found:', user)
  
  if (!user) {
    return null
  }

  // Check if user has a PIN set
  if (user.pin) {
    // If user has PIN, verify it
    if (!pin) {
      throw new Error('PIN é obrigatório')
    }
    
    const pinValid = await bcrypt.compare(pin, user.pin)
    if (!pinValid) {
      throw new Error('PIN incorreto')
    }
  }
  // For users without PIN (legacy), allow login without PIN temporarily
  
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
  cpf: string,
  pin: string
): Promise<AuthUser | null> {
  const cleanWhatsapp = whatsapp.replace(/\D/g, '')
  const cleanCPF = cpf.replace(/\D/g, '')
  
  if (!validateCPF(cleanCPF)) {
    throw new Error('CPF inválido')
  }

  // Validate PIN
  if (!/^\d{4}$/.test(pin)) {
    throw new Error('PIN deve conter exatamente 4 números')
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

  // Hash the PIN
  const pinHash = await bcrypt.hash(pin, 10)
  
  const user = await prisma.user.create({
    data: {
      name,
      whatsapp: cleanWhatsapp,
      cpf: cleanCPF,
      pin: pinHash,
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
