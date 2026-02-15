import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create admin user (sua mãe)
  const admin = await prisma.user.upsert({
    where: { cpf: '12345678900' },
    update: {},
    create: {
      name: 'Administrador',
      whatsapp: '5511999999999',
      cpf: '12345678900',
      role: 'admin',
    },
  })
  console.log('Created admin user:', admin.name)

  // Create test client
  const client = await prisma.user.upsert({
    where: { cpf: '98765432100' },
    update: {},
    create: {
      name: 'Cliente Teste',
      whatsapp: '5511988888888',
      cpf: '98765432100',
      role: 'client',
    },
  })
  console.log('Created test client:', client.name)

  // Create sample products
  const products = [
    {
      name: 'Bolo de Chocolate',
      description: 'Delicioso bolo de chocolate com cobertura cremosa',
      price: 89.90,
      instagramUrl: 'https://www.instagram.com/p/example1/',
      imageUrl: 'https://via.placeholder.com/400x400/8B4513/FFFFFF?text=Bolo+de+Chocolate',
      active: true,
    },
    {
      name: 'Bolo de Morango',
      description: 'Bolo leve com morangos frescos e chantilly',
      price: 95.00,
      instagramUrl: 'https://www.instagram.com/p/example2/',
      imageUrl: 'https://via.placeholder.com/400x400/FF1493/FFFFFF?text=Bolo+de+Morango',
      active: true,
    },
    {
      name: 'Bolo de Cenoura',
      description: 'Tradicional bolo de cenoura com cobertura de chocolate',
      price: 69.90,
      instagramUrl: 'https://www.instagram.com/p/example3/',
      imageUrl: 'https://via.placeholder.com/400x400/FFA500/FFFFFF?text=Bolo+de+Cenoura',
      active: true,
    },
    {
      name: 'Bolo Red Velvet',
      description: 'Sofisticado bolo red velvet com cream cheese',
      price: 120.00,
      instagramUrl: 'https://www.instagram.com/p/example4/',
      imageUrl: 'https://via.placeholder.com/400x400/DC143C/FFFFFF?text=Red+Velvet',
      active: true,
    },
  ]

  for (const product of products) {
    const created = await prisma.product.create({
      data: product,
    })
    console.log('Created product:', created.name)
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
