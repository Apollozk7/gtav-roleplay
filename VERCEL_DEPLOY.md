# 🚀 Deploy na Vercel - NO NPC NETWORK

## Passo 1: Preparar o GitHub

### 1.1 Criar repositório no GitHub
1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome: `npcnetwork` (ou o que preferir)
4. Marque como **Público** (para plano gratuito da Vercel)
5. **NÃO** marque "Add a README file" (já temos um)

### 1.2 Fazer upload do projeto
```bash
# No terminal, na pasta do projeto:
git init
git add .
git commit -m "Initial commit - NO NPC NETWORK"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/npcnetwork.git
git push -u origin main
```

## Passo 2: Deploy na Vercel

### 2.1 Criar conta na Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up"
3. **Escolha "Continue with GitHub"** (importante!)
4. Autorize a Vercel a acessar seus repositórios

### 2.2 Importar projeto
1. Clique em "New Project"
2. Encontre seu repositório `npcnetwork`
3. Clique em "Import"
4. **Framework Preset:** Next.js (deve detectar automaticamente)
5. Clique em "Deploy"

## Passo 3: Configurar Banco de Dados

### 3.1 Criar banco PostgreSQL na Vercel
1. No painel da Vercel, vá em **"Storage"**
2. Clique em **"Create Database"**
3. Escolha **"Postgres"**
4. Nome: `npcnetwork-db`
5. Clique em **"Create"**

### 3.2 Configurar variáveis de ambiente
1. No painel da Vercel, vá em **"Settings"** → **"Environment Variables"**
2. Adicione as seguintes variáveis:

```
NEXTAUTH_URL = https://seu-projeto.vercel.app
NEXTAUTH_SECRET = [GERE_UMA_CHAVE_SECRETA]
DATABASE_URL = [COPIE_A_URL_DO_BANCO_POSTGRES]
DISCORD_WEBHOOK_URL = [SEU_WEBHOOK_DO_DISCORD]
```

### 3.3 Gerar NEXTAUTH_SECRET
```bash
# No terminal:
openssl rand -base64 32
```
Ou use este gerador online: https://generate-secret.vercel.app/32

## Passo 4: Configurar o Banco

### 4.1 Instalar Vercel CLI
```bash
npm install -g vercel
```

### 4.2 Fazer login na Vercel
```bash
vercel login
```

### 4.3 Configurar banco localmente
```bash
# Baixar variáveis de ambiente
vercel env pull .env.local

# Aplicar migrações
npx prisma db push

# Gerar cliente Prisma
npx prisma generate

# Configurar dados iniciais
npm run setup-production
```

## Passo 5: Deploy Final

### 5.1 Fazer novo deploy
```bash
# Fazer commit das mudanças
git add .
git commit -m "Configure for production"
git push

# Ou fazer deploy direto
vercel --prod
```

### 5.2 Verificar se funcionou
1. Acesse sua URL da Vercel
2. Teste o login com:
   - **Email:** admin@nonpc.network
   - **Senha:** admin123

## 🔧 Comandos Úteis

```bash
# Ver logs da Vercel
vercel logs

# Fazer deploy de desenvolvimento
vercel

# Fazer deploy de produção
vercel --prod

# Ver status do projeto
vercel ls
```

## ⚠️ Troubleshooting

### Erro de banco de dados
- Verifique se a `DATABASE_URL` está correta
- Execute `npx prisma db push` novamente

### Erro de autenticação
- Verifique se `NEXTAUTH_SECRET` está configurado
- Verifique se `NEXTAUTH_URL` está correto

### Erro de build
- Verifique os logs na Vercel
- Teste localmente com `npm run build`

## 🎉 Pronto!

Seu site estará online em: `https://seu-projeto.vercel.app`

**Credenciais de admin:**
- Email: admin@nonpc.network
- Senha: admin123

Compartilhe a URL com seus amigos! 🚀
