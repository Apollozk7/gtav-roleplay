# 🚀 Guia de Deploy - NO NPC NETWORK

## Opção 1: Deploy na Vercel (Recomendado)

### Passo 1: Preparar o Projeto
1. **Criar conta no GitHub** (se não tiver)
2. **Fazer upload do projeto para o GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/npcnetwork.git
   git push -u origin main
   ```

### Passo 2: Deploy na Vercel
1. **Acesse:** https://vercel.com
2. **Faça login** com sua conta GitHub
3. **Clique em "New Project"**
4. **Importe seu repositório** do GitHub
5. **Configure as variáveis de ambiente:**

#### Variáveis de Ambiente Necessárias:
```
DATABASE_URL=postgresql://usuario:senha@host:porta/database
NEXTAUTH_SECRET=sua-chave-secreta-super-segura-para-producao
NEXTAUTH_URL=https://seu-projeto.vercel.app
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/SEU_WEBHOOK
```

### Passo 3: Configurar Banco de Dados
**Opção A: Vercel Postgres (Recomendado)**
1. No painel da Vercel, vá em "Storage"
2. Clique em "Create Database" → "Postgres"
3. Copie a `DATABASE_URL` gerada
4. Cole nas variáveis de ambiente

**Opção B: PlanetScale (Gratuito)**
1. Acesse: https://planetscale.com
2. Crie uma conta gratuita
3. Crie um novo banco
4. Copie a connection string

### Passo 4: Executar Migrações
Após o deploy, você precisará executar as migrações do Prisma:

1. **Instale a Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Execute as migrações:**
   ```bash
   vercel env pull .env.local
   npx prisma db push
   npx prisma generate
   ```

3. **Criar usuário admin:**
   ```bash
   npm run create-admin
   ```

## Opção 2: Deploy no Netlify

### Passo 1: Preparar Build
1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Fazer build:**
   ```bash
   npm run build
   ```

### Passo 2: Deploy
1. **Acesse:** https://netlify.com
2. **Arraste a pasta `out`** (se usar export estático) ou conecte com GitHub
3. **Configure as variáveis de ambiente** no painel

## Opção 3: Túnel Local (Para Testes Rápidos)

### Usando ngrok:
1. **Instale o ngrok:** https://ngrok.com
2. **Execute:**
   ```bash
   ngrok http 3000
   ```
3. **Compartilhe a URL** gerada (ex: https://abc123.ngrok.io)

### Usando Cloudflare Tunnel:
1. **Instale cloudflared**
2. **Execute:**
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

## ⚠️ Importante para Produção

### Segurança:
- ✅ Use senhas fortes para `NEXTAUTH_SECRET`
- ✅ Configure HTTPS (automático na Vercel/Netlify)
- ✅ Use banco de dados seguro (não SQLite em produção)
- ✅ Configure CORS adequadamente

### Performance:
- ✅ Use CDN (automático na Vercel/Netlify)
- ✅ Configure cache headers
- ✅ Otimize imagens

### Monitoramento:
- ✅ Configure logs de erro
- ✅ Monitore performance
- ✅ Configure alertas

## 🔧 Comandos Úteis

```bash
# Build local
npm run build

# Teste de produção local
npm run start

# Verificar lint
npm run lint

# Reset do banco (CUIDADO!)
npx prisma db push --force-reset

# Gerar cliente Prisma
npx prisma generate
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs da Vercel/Netlify
2. Confirme se todas as variáveis de ambiente estão configuradas
3. Teste localmente primeiro
4. Verifique se o banco de dados está acessível

---

**🎯 Recomendação:** Use a Vercel + Vercel Postgres para o melhor resultado!
