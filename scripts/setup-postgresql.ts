import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function setupPostgreSQL() {
  try {
    console.log('🚀 Configurando banco PostgreSQL...')
    
    // Testar conexão
    await prisma.$connect()
    console.log('✅ Conexão com PostgreSQL estabelecida!')
    
    // Criar usuário admin se não existir
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@nonpc.network' }
    })

    if (!existingAdmin) {
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
      console.log('   - Email: admin@nonpc.network')
      console.log('   - Senha: admin123')
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

    // Criar contatos padrão se não existirem
    const existingContacts = await prisma.contact.count()
    
    if (existingContacts === 0) {
      const defaultContacts = [
        {
          type: 'DISCORD' as const,
          label: 'Discord Principal',
          value: 'npcnetwork#1234',
          description: 'Canal principal para comunicação'
        },
        {
          type: 'TELEGRAM' as const,
          label: 'Telegram',
          value: '@npcnetwork',
          description: 'Grupo do Telegram'
        },
        {
          type: 'PHONE' as const,
          label: 'WhatsApp',
          value: '+55 11 99999-9999',
          description: 'Contato direto via WhatsApp'
        }
      ]

      for (const contact of defaultContacts) {
        await prisma.contact.create({
          data: contact
        })
      }
      
      console.log('✅ Contatos padrão criados!')
    } else {
      console.log('ℹ️  Contatos já existem')
    }

    console.log('🎉 Configuração do PostgreSQL concluída com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro na configuração:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

setupPostgreSQL()
