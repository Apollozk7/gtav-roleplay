import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanDatabase() {
  try {
    console.log('🧹 Iniciando limpeza do banco de dados...')
    
    // Testar conexão
    await prisma.$connect()
    console.log('✅ Conexão estabelecida!')
    
    // Contar registros antes da limpeza
    const userCount = await prisma.user.count()
    const eventCount = await prisma.event.count()
    const participantCount = await prisma.participant.count()
    const betCount = await prisma.bet.count()
    const serviceCount = await prisma.service.count()
    const serviceRequestCount = await prisma.serviceRequest.count()
    const contactCount = await prisma.contact.count()
    
    console.log('📊 Estado atual do banco:')
    console.log(`   - Usuários: ${userCount}`)
    console.log(`   - Eventos: ${eventCount}`)
    console.log(`   - Participantes: ${participantCount}`)
    console.log(`   - Apostas: ${betCount}`)
    console.log(`   - Serviços: ${serviceCount}`)
    console.log(`   - Solicitações de serviço: ${serviceRequestCount}`)
    console.log(`   - Contatos: ${contactCount}`)
    
    // Deletar dados em ordem (respeitando as relações de chave estrangeira)
    console.log('🗑️  Removendo dados...')
    
    // 1. Deletar apostas primeiro (dependem de usuário, evento e participante)
    await prisma.bet.deleteMany({})
    console.log('   ✅ Apostas removidas')
    
    // 2. Deletar solicitações de serviço (dependem de usuário e serviço)
    await prisma.serviceRequest.deleteMany({})
    console.log('   ✅ Solicitações de serviço removidas')
    
    // 3. Deletar participantes (dependem de evento)
    await prisma.participant.deleteMany({})
    console.log('   ✅ Participantes removidos')
    
    // 4. Deletar eventos (dependem de usuário)
    await prisma.event.deleteMany({})
    console.log('   ✅ Eventos removidos')
    
    // 5. Deletar serviços (independente)
    await prisma.service.deleteMany({})
    console.log('   ✅ Serviços removidos')
    
    // 6. Deletar contatos (independente)
    await prisma.contact.deleteMany({})
    console.log('   ✅ Contatos removidos')
    
    // 7. Deletar usuários por último
    await prisma.user.deleteMany({})
    console.log('   ✅ Usuários removidos')
    
    // Verificar se a limpeza foi bem-sucedida
    const totalUsers = await prisma.user.count()
    const totalEvents = await prisma.event.count()
    const totalBets = await prisma.bet.count()
    const totalServices = await prisma.service.count()
    const totalContacts = await prisma.contact.count()
    
    if (totalUsers === 0 && totalEvents === 0 && totalBets === 0 && totalServices === 0 && totalContacts === 0) {
      console.log('🎉 Banco de dados limpo com sucesso!')
      console.log('📊 Todas as tabelas estão vazias agora.')
    } else {
      console.log('⚠️  Alguns registros ainda existem:')
      console.log(`   - Usuários: ${totalUsers}`)
      console.log(`   - Eventos: ${totalEvents}`)
      console.log(`   - Apostas: ${totalBets}`)
      console.log(`   - Serviços: ${totalServices}`)
      console.log(`   - Contatos: ${totalContacts}`)
    }
    
  } catch (error) {
    console.error('❌ Erro na limpeza do banco:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  cleanDatabase()
    .then(() => {
      console.log('✅ Script de limpeza finalizado!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Erro fatal:', error)
      process.exit(1)
    })
}

export default cleanDatabase
