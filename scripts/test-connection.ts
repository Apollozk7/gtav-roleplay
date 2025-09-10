import { PrismaClient } from '@prisma/client'

async function testConnection() {
  console.log('🔍 Testando conexão com o banco...')
  
  // Testar com a URL do PostgreSQL da Vercel
  const DATABASE_URL = "postgres://d9e9933a55ae5878b00ae982200a06294bc17ef257768866245dd85aece31810:sk_EUd9-Q3EVPa_SXpREuLyZ@db.prisma.io:5432/postgres?sslmode=require"
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL
      }
    }
  })

  try {
    // Testar conexão
    await prisma.$connect()
    console.log('✅ Conexão estabelecida!')
    
    // Testar consulta
    const userCount = await prisma.user.count()
    console.log(`📊 Total de usuários: ${userCount}`)
    
    // Testar consulta específica
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@nonpc.network' }
    })
    
    if (admin) {
      console.log('✅ Usuário admin encontrado!')
      console.log(`   - Username: ${admin.username}`)
      console.log(`   - Role: ${admin.role}`)
    } else {
      console.log('❌ Usuário admin não encontrado!')
    }
    
    // Testar serviços
    const serviceCount = await prisma.service.count()
    console.log(`📊 Total de serviços: ${serviceCount}`)
    
    console.log('🎉 Todos os testes passaram!')
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
