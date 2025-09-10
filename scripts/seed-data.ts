import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedData() {
  try {
    // Criar serviços padrão
    const services = [
      {
        name: 'Transporte Executivo',
        description: 'Serviço de transporte seguro e discreto para membros da crew',
        type: 'TRANSPORT',
        price: 500,
        isActive: true
      },
      {
        name: 'Operação de Roubo',
        description: 'Execução de roubos planejados com equipe especializada',
        type: 'THEFT',
        price: 2000,
        isActive: true
      },
      {
        name: 'Distração Tática',
        description: 'Criação de distrações para facilitar operações',
        type: 'DISTRACTION',
        price: 300,
        isActive: true
      },
      {
        name: 'Serviço Personalizado',
        description: 'Serviços sob medida conforme necessidade específica',
        type: 'OTHER',
        price: null,
        isActive: true
      }
    ]

    for (const service of services) {
      await prisma.service.upsert({
        where: { id: service.name }, // Usar um ID único baseado no nome
        update: {
          name: service.name,
          description: service.description,
          type: service.type as 'TRANSPORT' | 'THEFT' | 'DISTRACTION' | 'OTHER',
          price: service.price,
          isActive: service.isActive
        },
        create: {
          name: service.name,
          description: service.description,
          type: service.type as 'TRANSPORT' | 'THEFT' | 'DISTRACTION' | 'OTHER',
          price: service.price,
          isActive: service.isActive
        }
      })
    }

    console.log('Dados de exemplo criados com sucesso!')
  } catch (error) {
    console.error('Erro ao criar dados de exemplo:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedData()
