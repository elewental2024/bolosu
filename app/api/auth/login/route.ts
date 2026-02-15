import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { whatsapp, cpf } = body

    if (!whatsapp || !cpf) {
      return NextResponse.json(
        { error: 'WhatsApp e CPF são obrigatórios' },
        { status: 400 }
      )
    }

    const user = await loginUser(whatsapp, cpf)

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado ou credenciais inválidas' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}
