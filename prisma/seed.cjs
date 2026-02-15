require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  
  // Delete existing data
  await prisma.message.deleteMany({})
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.product.deleteMany({})
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
  
  // Create test client Maria Silva
  const maria = await prisma.user.create({
    data: {
      name: 'Maria Silva',
      whatsapp: '11987654321',
      cpf: '78292450378', // Valid CPF
      role: 'client'
    }
  })
  console.log('Test client created:', maria.name)
  
  // Create 10 beautiful cake products
  const products = [
    {
      name: 'Bolo de Chocolate Trufado',
      description: 'Camadas de chocolate meio amargo com recheio de trufa belga e cobertura de ganache sedoso',
      price: 85.00,
      instagramUrl: 'https://www.instagram.com/p/chocolate-trufado/',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
      active: true
    },
    {
      name: 'Bolo Red Velvet',
      description: 'Clássico bolo aveludado vermelho com frosting de cream cheese americano',
      price: 95.00,
      instagramUrl: 'https://www.instagram.com/p/red-velvet/',
      imageUrl: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=400&fit=crop',
      active: true
    },
    {
      name: 'Bolo de Morango com Chantilly',
      description: 'Pão de ló leve com morangos frescos e chantilly suave',
      price: 78.00,
      instagramUrl: 'https://www.instagram.com/p/morango-chantilly/',
      imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
      active: true
    },
    {
      name: 'Bolo de Cenoura com Chocolate',
      description: 'Tradicional bolo de cenoura fofinho com cobertura cremosa de chocolate',
      price: 65.00,
      instagramUrl: 'https://www.instagram.com/p/cenoura-chocolate/',
      imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=400&fit=crop',
      active: true
    },
    {
      name: 'Bolo de Limão Siciliano',
      description: 'Massa úmida de limão siciliano com cobertura de cream cheese e raspas de limão',
      price: 72.00,
      instagramUrl: 'https://www.instagram.com/p/limao-siciliano/',
      imageUrl: 'https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=400&h=400&fit=crop',
      active: true
    },
    {
      name: 'Bolo Nega Maluca',
      description: 'Bolo de chocolate super úmido com calda de chocolate quente',
      price: 68.00,
      instagramUrl: 'https://www.instagram.com/p/nega-maluca/',
      imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=400&fit=crop',
      active: true
    },
    {
      name: 'Bolo de Coco Gelado',
      description: 'Bolo gelado de coco com leite condensado e cobertura de coco ralado',
      price: 75.00,
      instagramUrl: 'https://www.instagram.com/p/coco-gelado/',
      imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
      active: true
    },
    {
      name: 'Bolo de Ninho com Nutella',
      description: 'Massa branca com recheio de leite ninho e camadas generosas de Nutella',
      price: 98.00,
      instagramUrl: 'https://www.instagram.com/p/ninho-nutella/',
      imageUrl: 'https://images.unsplash.com/photo-1540337706094-da10342c93d8?w=400&h=400&fit=crop',
      active: true
    },
    {
      name: 'Bolo de Abacaxi',
      description: 'Bolo tradicional com pedaços de abacaxi caramelizado e calda especial',
      price: 70.00,
      instagramUrl: 'https://www.instagram.com/p/abacaxi/',
      imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop',
      active: true
    },
    {
      name: 'Bolo de Brigadeiro Gourmet',
      description: 'Camadas de chocolate com recheio e cobertura de brigadeiro gourmet',
      price: 88.00,
      instagramUrl: 'https://www.instagram.com/p/brigadeiro-gourmet/',
      imageUrl: 'https://images.unsplash.com/photo-1606890658317-7d14490b76fd?w=400&h=400&fit=crop',
      active: true
    }
  ]

  const createdProducts = []
  for (const product of products) {
    const p = await prisma.product.create({ data: product })
    createdProducts.push(p)
    console.log(`Product created: ${p.name}`)
  }

  // Create a test order with 2 products
  const redVelvet = createdProducts.find(p => p.name === 'Bolo Red Velvet')
  const ninhoNutella = createdProducts.find(p => p.name === 'Bolo de Ninho com Nutella')

  const order = await prisma.order.create({
    data: {
      userId: maria.id,
      deliveryAddress: 'Rua das Flores, 123 - São Paulo/SP',
      deliveryDate: new Date(Date.now() + 86400000), // Tomorrow
      status: 'confirmed',
      deliveryFee: 15.00,
      totalPrice: 208.00,
      observations: 'Entregar pela manhã, favor tocar a campainha',
      items: {
        create: [
          {
            productId: redVelvet.id,
            quantity: 1,
            price: redVelvet.price
          },
          {
            productId: ninhoNutella.id,
            quantity: 1,
            price: ninhoNutella.price
          }
        ]
      }
    }
  })
  console.log('Test order created:', order.id)

  // Create test messages for the order
  await prisma.message.create({
    data: {
      orderId: order.id,
      userId: maria.id,
      content: 'Boa tarde! Gostaria de confirmar o horário de entrega'
    }
  })

  await prisma.message.create({
    data: {
      orderId: order.id,
      userId: admin.id,
      content: 'Olá Maria! Entregaremos entre 9h e 11h da manhã 😊'
    }
  })

  await prisma.message.create({
    data: {
      orderId: order.id,
      userId: maria.id,
      content: 'Perfeito! Obrigada!'
    }
  })
  
  console.log('Test messages created')
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
