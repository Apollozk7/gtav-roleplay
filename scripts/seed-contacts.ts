import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedContacts() {
  try {
    console.log('📞 Criando contatos padrão...')
    
    // Verificar se já existem contatos
    const existingContacts = await prisma.contact.count()
    
    if (existingContacts === 0) {
      // Criar contato burner padrão
      const defaultContact = await prisma.contact.create({
        data: {
          type: 'PHONE',
          label: 'Burner Phone',
          value: '+55 (11) 99999-9999',
          description: 'Número descartável para contatos urgentes da crew',
          isActive: true
        }
      })
      
      console.log('✅ Contato burner padrão criado!')
      console.log(`   - ID: ${defaultContact.id}`)
      console.log(`   - Label: ${defaultContact.label}`)
      console.log(`   - Valor: ${defaultContact.value}`)
    } else {
      console.log('ℹ️  Contatos já existem no banco')
    }

    console.log('🎉 Seed de contatos concluído!')
    
  } catch (error) {
    console.error('❌ Erro no seed de contatos:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedContacts()
