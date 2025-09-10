import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    await prisma.$connect()
    
    const userCount = await prisma.user.count()
    const eventCount = await prisma.event.count()
    const serviceCount = await prisma.service.count()
    const contactCount = await prisma.contact.count()
    
    console.log('📊 Estado atual do banco:')
    console.log(`   - Usuários: ${userCount}`)
    console.log(`   - Eventos: ${eventCount}`)
    console.log(`   - Serviços: ${serviceCount}`)
    console.log(`   - Contatos: ${contactCount}`)
    
    const total = userCount + eventCount + serviceCount + contactCount
    
    if (total === 0) {
      console.log('✅ Banco de dados está completamente vazio!')
    } else {
      console.log(`⚠️  O banco ainda contém ${total} registros no total.`)
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar banco:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
