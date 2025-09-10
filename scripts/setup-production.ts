import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function setupProduction() {
  try {
    console.log('🚀 Configurando banco de dados para produção...')
    
    // Verificar se o admin já existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@nonpc.network' }
    })

    if (!existingAdmin) {
      // Criar usuário admin
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
      
      console.log('✅ Usuário admin criado com sucesso!')
      console.log('📧 Email: admin@nonpc.network')
      console.log('🔑 Senha: admin123')
    } else {
      console.log('ℹ️  Usuário admin já existe')
    }

    // Verificar se os serviços padrão existem
    const existingServices = await prisma.service.count()
    
    if (existingServices === 0) {
      // Criar serviços padrão
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

      // Criar serviços diretamente (não usar upsert pois name não é único)
      for (const service of defaultServices) {
        await prisma.service.create({
          data: service
        })
      }
      
      console.log('✅ Serviços padrão criados com sucesso!')
    } else {
      console.log('ℹ️  Serviços já existem no banco')
    }

    console.log('🎉 Configuração de produção concluída!')
    
  } catch (error) {
    console.error('❌ Erro na configuração:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

setupProduction()
