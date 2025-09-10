import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testPostgreSQL() {
  try {
    console.log('🧪 Teste PostgreSQL - Verificando configuração...')
    
    // Testar conexão
    await prisma.$connect()
    console.log('✅ Conexão com PostgreSQL estabelecida!')
    
    // Testar usuários
    const userCount = await prisma.user.count()
    console.log(`👥 Total de usuários: ${userCount}`)
    
    // Testar admin
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@nonpc.network' }
    })
    
    if (admin) {
      console.log('✅ Usuário admin encontrado!')
      console.log(`   - Username: ${admin.username}`)
      console.log(`   - Role: ${admin.role}`)
    } else {
      console.log('ℹ️  Usuário admin não encontrado (será criado no primeiro deploy)')
    }
    
    // Testar serviços
    const serviceCount = await prisma.service.count()
    console.log(`🛠️  Total de serviços: ${serviceCount}`)
    
    if (serviceCount > 0) {
      const services = await prisma.service.findMany({
        take: 3
      })
      console.log('   Serviços disponíveis:')
      services.forEach(service => {
        console.log(`   - ${service.name}: R$ ${service.price}`)
      })
    } else {
      console.log('ℹ️  Serviços serão criados no primeiro deploy')
    }
    
    // Testar contatos
    const contactCount = await prisma.contact.count()
    console.log(`📞 Total de contatos: ${contactCount}`)
    
    if (contactCount > 0) {
      const contacts = await prisma.contact.findMany({
        take: 3
      })
      console.log('   Contatos disponíveis:')
      contacts.forEach(contact => {
        console.log(`   - ${contact.label}: ${contact.value}`)
      })
    } else {
      console.log('ℹ️  Contatos serão criados no primeiro deploy')
    }
    
    console.log('\n🎉 CONFIGURAÇÃO POSTGRESQL OK!')
    console.log('✅ O sistema está pronto para produção na Vercel!')
    console.log('\n📋 Próximos passos:')
    console.log('1. Crie um banco PostgreSQL na Vercel (Storage → Create Database)')
    console.log('2. Configure a DATABASE_URL nas variáveis de ambiente')
    console.log('3. Faça o deploy do projeto')
    console.log('4. Execute npm run setup-postgresql para criar dados iniciais')
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
    console.log('\n🔍 Possíveis soluções:')
    console.log('1. Verifique se a DATABASE_URL está configurada')
    console.log('2. Confirme se o banco PostgreSQL está acessível')
    console.log('3. Execute npx prisma db push para criar as tabelas')
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

testPostgreSQL()
