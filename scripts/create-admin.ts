import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      console.log('Admin já existe:', existingAdmin.username)
      return
    }

    // Criar admin padrão
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@nonpc.network',
        password: hashedPassword,
        cashTapUser: 'admin_cashtap',
        role: 'ADMIN'
      }
    })

    console.log('Admin criado com sucesso:')
    console.log('Username:', admin.username)
    console.log('Email:', admin.email)
    console.log('CashTap:', admin.cashTapUser)
    console.log('Senha: admin123')
  } catch (error) {
    console.error('Erro ao criar admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()


