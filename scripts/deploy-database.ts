import { PrismaClient } from '@prisma/client'

// Usar a URL do PostgreSQL da Vercel diretamente
const DATABASE_URL = "postgres://d9e9933a55ae5878b00ae982200a06294bc17ef257768866245dd85aece31810:sk_EUd9-Q3EVPa_SXpREuLyZ@db.prisma.io:5432/postgres?sslmode=require"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
})

async function deployDatabase() {
  try {
    console.log('🚀 Fazendo deploy do banco de dados PostgreSQL...')
    
    // Testar conexão
    await prisma.$connect()
    console.log('✅ Conexão com PostgreSQL estabelecida!')
    
    // Executar migrações (criar tabelas)
    console.log('📊 Criando tabelas...')
    
    // Criar usuário admin se não existir
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@nonpc.network' }
    })

    if (!existingAdmin) {
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@nonpc.network',
          password: hashedPassword,
          cashTapUser: 'admin_cashtap',
          role: 'ADMIN'
        }
      })
      
      console.log('✅ Usuário admin criado!')
    } else {
      console.log('ℹ️  Usuário admin já existe')
    }

    // Criar serviços padrão se não existirem
    const existingServices = await prisma.service.count()
    
    if (existingServices === 0) {
      const defaultServices = [
        {
          name: 'Transporte Seguro',
          description: 'Transporte discreto e seguro para qualquer localização',
          price: 5000,
          type: 'TRANSPORT' as const
        },
        {
          name: 'Distração Policial',
          description: 'Criação de distrações para facilitar operações',
          price: 3000,
          type: 'DISTRACTION' as const
        },
        {
          name: 'Roubo Coordenado',
          description: 'Operações de roubo com planejamento detalhado',
          price: 10000,
          type: 'THEFT' as const
        },
        {
          name: 'Inteligência',
          description: 'Coleta de informações e vigilância',
          price: 7000,
          type: 'OTHER' as const
        }
      ]

      for (const service of defaultServices) {
        await prisma.service.create({
          data: service
        })
      }
      
      console.log('✅ Serviços padrão criados!')
    } else {
      console.log('ℹ️  Serviços já existem')
    }

    console.log('🎉 Deploy do banco concluído com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro no deploy:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

deployDatabase()
