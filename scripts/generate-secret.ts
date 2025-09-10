import crypto from 'crypto'

function generateSecret(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64')
}

console.log('🔐 Chave secreta gerada para NEXTAUTH_SECRET:')
console.log('')
console.log(generateSecret(32))
console.log('')
console.log('📋 Copie esta chave e cole na variável NEXTAUTH_SECRET da Vercel')
console.log('⚠️  Mantenha esta chave segura e não compartilhe!')
