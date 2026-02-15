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
  
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      whatsapp: '11999999999',
      cpf: '11144477735', // Valid CPF
      role: 'admin'
    }
  })
  console.log('✅ Admin user created:', admin.name)
  
  // Create fake client - Maria Silva
  const maria = await prisma.user.create({
    data: {
      name: 'Maria Silva',
      whatsapp: '11987654321',
      cpf: '12345678900', // Valid format
      role: 'client'
    }
  })
  console.log('✅ Fake client created:', maria.name)
  
  // Create 10 products
  const products = [
    {
      name: 'Bolo de Chocolate Trufado',
      description: 'Delicioso bolo de chocolate com recheio de trufa e cobertura de ganache. Perfeito para os amantes de chocolate!',
      price: 85.00,
      instagramUrl: 'https://www.instagram.com/p/chocolate/',
      imageUrl: 'https://via.placeholder.com/400x400/8B4513/ffffff?text=Chocolate+Trufado',
      active: true
    },
    {
      name: 'Bolo Red Velvet',
      description: 'Clássico bolo red velvet com cream cheese. Massa aveludada e sabor inigualável!',
      price: 95.00,
      instagramUrl: 'https://www.instagram.com/p/redvelvet/',
      imageUrl: 'https://via.placeholder.com/400x400/DC143C/ffffff?text=Red+Velvet',
      active: true
    },
    {
      name: 'Bolo de Morango com Chantilly',
      description: 'Bolo fresco com morangos selecionados e chantilly caseiro. Leve e delicioso!',
      price: 78.00,
      instagramUrl: 'https://www.instagram.com/p/morango/',
      imageUrl: 'https://via.placeholder.com/400x400/FF1493/ffffff?text=Morango',
      active: true
    },
    {
      name: 'Bolo de Cenoura com Chocolate',
      description: 'Tradicional bolo de cenoura com cobertura de chocolate. Um clássico brasileiro!',
      price: 65.00,
      instagramUrl: 'https://www.instagram.com/p/cenoura/',
      imageUrl: 'https://via.placeholder.com/400x400/FF8C00/ffffff?text=Cenoura',
      active: true
    },
    {
      name: 'Bolo de Limão Siciliano',
      description: 'Bolo refrescante de limão siciliano com cobertura cremosa. Perfeito para o verão!',
      price: 72.00,
      instagramUrl: 'https://www.instagram.com/p/limao/',
      imageUrl: 'https://via.placeholder.com/400x400/FFFF00/000000?text=Limao',
      active: true
    },
    {
      name: 'Bolo Nega Maluca',
      description: 'Bolo de chocolate extra molhadinho. Uma tentação irresistível!',
      price: 68.00,
      instagramUrl: 'https://www.instagram.com/p/negamaluca/',
      imageUrl: 'https://via.placeholder.com/400x400/654321/ffffff?text=Nega+Maluca',
      active: true
    },
    {
      name: 'Bolo de Coco Gelado',
      description: 'Bolo de coco úmido com coco ralado fresco. Servido gelado!',
      price: 75.00,
      instagramUrl: 'https://www.instagram.com/p/coco/',
      imageUrl: 'https://via.placeholder.com/400x400/F5F5DC/000000?text=Coco+Gelado',
      active: true
    },
    {
      name: 'Bolo de Ninho com Nutella',
      description: 'Combinação perfeita de leite ninho e nutella. Sucesso garantido!',
      price: 98.00,
      instagramUrl: 'https://www.instagram.com/p/ninho/',
      imageUrl: 'https://via.placeholder.com/400x400/FFE4B5/000000?text=Ninho+Nutella',
      active: true
    },
    {
      name: 'Bolo de Abacaxi',
      description: 'Bolo tradicional de abacaxi com pedaços de fruta. Sabor tropical!',
      price: 70.00,
      instagramUrl: 'https://www.instagram.com/p/abacaxi/',
      imageUrl: 'https://via.placeholder.com/400x400/FFD700/000000?text=Abacaxi',
      active: true
    },
    {
      name: 'Bolo de Brigadeiro Gourmet',
      description: 'Bolo de chocolate com recheio e cobertura de brigadeiro gourmet. Uma explosão de sabor!',
      price: 88.00,
      instagramUrl: 'https://www.instagram.com/p/brigadeiro/',
      imageUrl: 'https://via.placeholder.com/400x400/4B0082/ffffff?text=Brigadeiro',
      active: true
    }
  ]
  
  const createdProducts = []
  for (const product of products) {
    const created = await prisma.product.create({ data: product })
    createdProducts.push(created)
    console.log(`✅ Product created: ${created.name}`)
  }
  
  // Create test order for Maria
  const order = await prisma.order.create({
    data: {
      userId: maria.id,
      status: 'confirmed',
      deliveryAddress: 'Rua das Flores, 123 - São Paulo/SP',
      deliveryDate: new Date(Date.now() + 86400000), // Tomorrow
      observations: 'Entregar pela manhã, favor tocar a campainha',
      deliveryFee: 15.00,
      totalPrice: 208.00,
      items: {
        create: [
          {
            productId: createdProducts[1].id, // Red Velvet
            quantity: 1,
            price: 95.00
          },
          {
            productId: createdProducts[7].id, // Ninho com Nutella
            quantity: 1,
            price: 98.00
          }
        ]
      }
    }
  })
  console.log('✅ Test order created:', order.id)
  
  // Create test messages
  const message1 = await prisma.message.create({
    data: {
      orderId: order.id,
      userId: maria.id,
      content: 'Boa tarde! Gostaria de confirmar o horário de entrega'
    }
  })
  console.log('✅ Message 1 created')
  
  const message2 = await prisma.message.create({
    data: {
      orderId: order.id,
      userId: admin.id,
      content: 'Olá Maria! Entregaremos entre 9h e 11h da manhã 😊'
    }
  })
  console.log('✅ Message 2 created')
  
  const message3 = await prisma.message.create({
    data: {
      orderId: order.id,
      userId: maria.id,
      content: 'Perfeito! Obrigada!'
    }
  })
  console.log('✅ Message 3 created')
  
  console.log('\n🎉 Seeding completed successfully!')
  console.log(`📦 Created ${createdProducts.length} products`)
  console.log(`👤 Created 2 users (1 admin, 1 client)`)
  console.log(`🛒 Created 1 order with 2 items`)
  console.log(`💬 Created 3 messages`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
