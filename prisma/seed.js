const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  
  const admin = await prisma.user.upsert({
    where: { cpf: '12345678900' },
    update: {},
    create: {
      name: 'Administrador',
      whatsapp: '11999999999',
      cpf: '12345678900',
      role: 'admin'
    }
  })
  console.log('Admin user created:', admin.name)
  
  const client = await prisma.user.upsert({
    where: { cpf: '98765432100' },
    update: {},
    create: {
      name: 'Cliente Teste',
      whatsapp: '11988888888',
      cpf: '98765432100',
      role: 'client'
    }
  })
  console.log('Test client created:', client.name)
  
  const existingProducts = await prisma.product.count()
  
  if (existingProducts === 0) {
    await prisma.product.create({
      data: {
        name: 'Bolo de Chocolate',
        description: 'Delicioso bolo de chocolate com cobertura de ganache',
        price: 80.00,
        instagramUrl: 'https://www.instagram.com/p/example1/',
        imageUrl: 'https://via.placeholder.com/400x400/4a90e2/ffffff?text=Bolo+Chocolate',
        active: true
      }
    })
    console.log('Product 1 created')
    
    await prisma.product.create({
      data: {
        name: 'Bolo de Morango',
        description: 'Bolo fresco com morangos e chantilly',
        price: 90.00,
        instagramUrl: 'https://www.instagram.com/p/example2/',
        imageUrl: 'https://via.placeholder.com/400x400/e74c3c/ffffff?text=Bolo+Morango',
        active: true
      }
    })
    console.log('Product 2 created')
  }
  
  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
