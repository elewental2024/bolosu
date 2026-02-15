import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, whatsapp, cpf, pin } = body

    if (!name || !whatsapp || !cpf || !pin) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Validate PIN
    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: 'PIN deve conter exatamente 4 números' },
        { status: 400 }
      )
    }

    const user = await registerUser(name, whatsapp, cpf, pin)

    return NextResponse.json({ user }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao cadastrar' },
      { status: 400 }
    )
  }
}
