import { execSync } from 'child_process'

async function deployVercel() {
  try {
    console.log('🚀 Iniciando deploy para Vercel...')
    
    // 1. Verificar se Vercel CLI está instalado
    try {
      execSync('vercel --version', { stdio: 'pipe' })
      console.log('✅ Vercel CLI encontrado')
    } catch {
      console.log('📦 Instalando Vercel CLI...')
      execSync('npm i -g vercel', { stdio: 'inherit' })
    }
    
    // 2. Fazer login na Vercel (se necessário)
    console.log('🔐 Verificando login na Vercel...')
    try {
      execSync('vercel whoami', { stdio: 'pipe' })
      console.log('✅ Já logado na Vercel')
    } catch {
      console.log('🔑 Fazendo login na Vercel...')
      execSync('vercel login', { stdio: 'inherit' })
    }
    
    // 3. Baixar variáveis de ambiente
    console.log('📥 Baixando variáveis de ambiente...')
    try {
      execSync('vercel env pull .env.local', { stdio: 'inherit' })
      console.log('✅ Variáveis de ambiente baixadas')
    } catch (error) {
      console.log('⚠️  Erro ao baixar variáveis de ambiente:', error)
      console.log('   Certifique-se de que o projeto está conectado à Vercel')
    }
    
    // 4. Executar migrações do banco
    console.log('🗄️  Executando migrações do banco...')
    try {
      execSync('npx prisma db push', { stdio: 'inherit' })
      console.log('✅ Migrações executadas com sucesso')
    } catch (error) {
      console.log('❌ Erro nas migrações:', error)
      console.log('   Verifique se a DATABASE_URL está configurada corretamente')
      throw error
    }
    
    // 5. Configurar dados iniciais
    console.log('🌱 Configurando dados iniciais...')
    try {
      execSync('npm run setup-postgresql', { stdio: 'inherit' })
      console.log('✅ Dados iniciais configurados')
    } catch (error) {
      console.log('⚠️  Erro ao configurar dados iniciais:', error)
      console.log('   Você pode executar manualmente: npm run setup-postgresql')
    }
    
    console.log('\n🎉 Deploy concluído com sucesso!')
    console.log('✅ Seu projeto está funcionando na Vercel')
    console.log('\n📋 Próximos passos:')
    console.log('1. Acesse seu projeto na Vercel')
    console.log('2. Teste a criação de contas')
    console.log('3. Faça login com admin@nonpc.network / admin123')
    
  } catch (error) {
    console.error('❌ Erro no deploy:', error)
    console.log('\n🔍 Soluções:')
    console.log('1. Verifique se o banco PostgreSQL foi criado na Vercel')
    console.log('2. Confirme se a DATABASE_URL está configurada')
    console.log('3. Execute manualmente: npx prisma db push')
    throw error
  }
}

deployVercel()
