const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  
  // Delete existing users to avoid conflicts
  await prisma.user.deleteMany({})
  
  // Create admin user with valid CPF
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      whatsapp: '11999999999',
      cpf: '11144477735', // Valid CPF
      role: 'admin'
    }
  })
  console.log('Admin user created:', admin.name)
  
  // Create test client with valid CPF
  const client = await prisma.user.create({
    data: {
      name: 'Cliente Teste',
      whatsapp: '11988888888',
      cpf: '78292450378', // Valid CPF
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
    
    await prisma.product.create({
      data: {
        name: 'Bolo Red Velvet',
        description: 'Clássico bolo red velvet com cream cheese',
        price: 95.00,
        instagramUrl: 'https://www.instagram.com/p/example3/',
        imageUrl: 'https://via.placeholder.com/400x400/c0392b/ffffff?text=Red+Velvet',
        active: true
      }
    })
    console.log('Product 3 created')
    
    await prisma.product.create({
      data: {
        name: 'Bolo de Cenoura',
        description: 'Tradicional bolo de cenoura com cobertura de chocolate',
        price: 70.00,
        instagramUrl: 'https://www.instagram.com/p/example4/',
        imageUrl: 'https://via.placeholder.com/400x400/e67e22/ffffff?text=Bolo+Cenoura',
        active: true
      }
    })
    console.log('Product 4 created')
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
