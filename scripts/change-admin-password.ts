import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

// Função para ler input do usuário
function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

async function changeAdminPassword() {
  try {
    console.log('🔐 Alterando senha do usuário admin...')
    
    // Verificar se o admin existe
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@nonpc.network' }
    })

    if (!admin) {
      console.log('❌ Usuário admin não encontrado!')
      return
    }

    console.log(`✅ Usuário admin encontrado: ${admin.username}`)
    
    // Pedir nova senha
    const newPassword = await askQuestion('Digite a nova senha: ')
    
    if (!newPassword || newPassword.length < 3) {
      console.log('❌ Senha deve ter pelo menos 3 caracteres!')
      return
    }

    // Confirmar senha
    const confirmPassword = await askQuestion('Confirme a nova senha: ')
    
    if (newPassword !== confirmPassword) {
      console.log('❌ Senhas não coincidem!')
      return
    }

    // Criptografar nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    // Atualizar senha no banco
    await prisma.user.update({
      where: { email: 'admin@nonpc.network' },
      data: { password: hashedPassword }
    })

    console.log('✅ Senha alterada com sucesso!')
    console.log(`📧 Email: admin@nonpc.network`)
    console.log(`🔑 Nova senha: ${newPassword}`)
    
  } catch (error) {
    console.error('❌ Erro ao alterar senha:', error)
  } finally {
    await prisma.$disconnect()
  }
}

changeAdminPassword()
