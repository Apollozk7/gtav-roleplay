# 🔧 Configuração de Variáveis de Ambiente - Vercel

## ⚠️ Erro Resolvido!

O erro `"NEXTAUTH_URL" references Secret "nextauth_url", which does not exist` foi corrigido. As variáveis de ambiente devem ser configuradas manualmente no painel da Vercel.

## 📋 Passo a Passo - Configurar Variáveis

### 1. Acesse o painel da Vercel
1. Vá para [vercel.com](https://vercel.com)
2. Faça login na sua conta
3. Clique no seu projeto `npcnetwork`

### 2. Vá para as configurações
1. Clique na aba **"Settings"**
2. Clique em **"Environment Variables"** no menu lateral

### 3. Adicione as variáveis uma por uma

#### Variável 1: NEXTAUTH_URL
- **Name:** `NEXTAUTH_URL`
- **Value:** `https://seu-projeto.vercel.app` (substitua pelo seu domínio)
- **Environment:** Marque todas as opções (Production, Preview, Development)
- Clique em **"Save"**

#### Variável 2: NEXTAUTH_SECRET
- **Name:** `NEXTAUTH_SECRET`
- **Value:** `SAsJLHvZ55Q8Y+l8y+7S3q/fLPkvb4NCrvgdqwmwLE4=`
- **Environment:** Marque todas as opções
- Clique em **"Save"**

#### Variável 3: DATABASE_URL
- **Name:** `DATABASE_URL`
- **Value:** `[URL do seu banco PostgreSQL da Vercel]`
- **Environment:** Marque todas as opções
- Clique em **"Save"**

#### Variável 4: DISCORD_WEBHOOK_URL (Opcional)
- **Name:** `DISCORD_WEBHOOK_URL`
- **Value:** `[Seu webhook do Discord]`
- **Environment:** Marque todas as opções
- Clique em **"Save"**

## 🔄 Após configurar as variáveis

### 1. Fazer novo deploy
```bash
# No terminal do seu projeto:
git add .
git commit -m "Fix environment variables"
git push
```

### 2. Ou fazer redeploy na Vercel
1. No painel da Vercel, vá em **"Deployments"**
2. Clique nos três pontos do último deploy
3. Clique em **"Redeploy"**

## ✅ Verificar se funcionou

1. Acesse sua URL da Vercel
2. Teste o login com:
   - **Email:** admin@nonpc.network
   - **Senha:** admin123

## 🚨 Troubleshooting

### Se ainda der erro:
1. Verifique se todas as variáveis foram salvas
2. Confirme se o `NEXTAUTH_URL` está correto (com https://)
3. Faça um redeploy após configurar as variáveis
4. Verifique os logs na aba "Functions" da Vercel

### Logs úteis:
- Vercel Dashboard → Seu Projeto → "Functions" → Ver logs de erro
- Ou use: `vercel logs` no terminal

## 📞 Precisa de ajuda?

Se ainda tiver problemas:
1. Verifique se o banco PostgreSQL foi criado
2. Confirme se a `DATABASE_URL` está correta
3. Teste localmente primeiro com `npm run dev`

