import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, whatsapp, cpf } = body

    if (!name || !whatsapp || !cpf) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    const user = await registerUser(name, whatsapp, cpf)

    return NextResponse.json({ user }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao cadastrar' },
      { status: 400 }
    )
  }
}
