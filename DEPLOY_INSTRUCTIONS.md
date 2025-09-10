# 🚀 Instruções de Deploy - NO NPC NETWORK

## ✅ Tudo configurado! Agora siga estes passos:

### 1. 📁 Criar repositório no GitHub
1. Acesse [github.com](https://github.com) e faça login
2. Clique em "New repository"
3. Nome: `npcnetwork`
4. Marque como **Público**
5. **NÃO** marque "Add a README file"
6. Clique em "Create repository"

### 2. 📤 Fazer upload do projeto
```bash
git init
git add .
git commit -m "Initial commit - NO NPC NETWORK"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/npcnetwork.git
git push -u origin main
```

### 3. 🌐 Deploy na Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up" → "Continue with GitHub"
3. Clique em "New Project"
4. Importe seu repositório `npcnetwork`
5. Clique em "Deploy"

### 4. 🗄️ Configurar banco de dados
1. No painel da Vercel, vá em **"Storage"**
2. Clique em **"Create Database"** → **"Postgres"**
3. Nome: `npcnetwork-db`
4. Clique em **"Create"**
5. Copie a `DATABASE_URL` gerada

### 5. 🔧 Configurar variáveis de ambiente
No painel da Vercel, vá em **"Settings"** → **"Environment Variables"** e adicione:

**IMPORTANTE:** Configure estas variáveis **ANTES** de fazer o deploy final!

```
NEXTAUTH_URL = https://seu-projeto.vercel.app
NEXTAUTH_SECRET = SAsJLHvZ55Q8Y+l8y+7S3q/fLPkvb4NCrvgdqwmwLE4=
DATABASE_URL = [URL_DO_BANCO_POSTGRES_COPIADA]
DISCORD_WEBHOOK_URL = [SEU_WEBHOOK_DO_DISCORD]
```

**⚠️ Dica:** Após adicionar cada variável, clique em "Save" antes de adicionar a próxima.

### 6. 🚀 Deploy final
```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Baixar variáveis de ambiente
vercel env pull .env.local

# Configurar banco
npx prisma db push
npx prisma generate
npm run setup-production

# Deploy
vercel --prod
```

## 🎉 Pronto!

Seu site estará online em: `https://seu-projeto.vercel.app`

**Credenciais de admin:**
- Email: admin@nonpc.network
- Senha: admin123

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs na Vercel
2. Confirme se todas as variáveis estão configuradas
3. Teste localmente primeiro

**Guia completo:** Veja `VERCEL_DEPLOY.md`
