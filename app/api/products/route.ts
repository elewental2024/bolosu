import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validations'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = productSchema.parse(body)

    // Extract Instagram image (simplified - in production use Instagram oEmbed API)
    let imageUrl = validatedData.instagramUrl
    
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        imageUrl,
      },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao criar produto' },
      { status: 400 }
    )
  }
}
