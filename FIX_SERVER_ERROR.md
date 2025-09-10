# 🔧 Correção do Erro de Servidor - Vercel

## ❌ Erro encontrado:
```
Server error
There is a problem with the server configuration.
Check the server logs for more information.
```

## 🔍 Possíveis causas:
1. **Banco de dados não configurado** - PostgreSQL não foi inicializado
2. **Variáveis de ambiente incorretas** - `DATABASE_URL` ou `NEXTAUTH_SECRET` inválidas
3. **Schema Prisma incorreto** - Configurado para SQLite em vez de PostgreSQL

## ✅ Correções aplicadas:

### 1. Schema Prisma corrigido
- Alterado de `sqlite` para `postgresql`
- Cliente Prisma regenerado

### 2. Script de deploy criado
- `scripts/deploy-database.ts` - Para inicializar o banco PostgreSQL
- `npm run deploy-database` - Comando para executar

## 📋 Próximos passos:

### 1. Fazer commit das correções
```bash
git add .
git commit -m "Fix PostgreSQL configuration and server error"
git push
```

### 2. Verificar variáveis de ambiente na Vercel
Certifique-se de que estão configuradas:
- `DATABASE_URL` = `postgres://d9e9933a55ae5878b00ae982200a06294bc17ef257768866245dd85aece31810:sk_EUd9-Q3EVPa_SXpREuLyZ@db.prisma.io:5432/postgres?sslmode=require`
- `NEXTAUTH_SECRET` = `sua-chave-secreta-super-segura-para-producao`
- `NEXTAUTH_URL` = `https://seu-projeto.vercel.app`

### 3. Aguardar novo deploy
- A Vercel fará um novo build automaticamente
- O `postinstall` script executará `prisma generate`

### 4. Inicializar banco de dados
Após o deploy, você pode executar o script de deploy do banco:
```bash
npm run deploy-database
```

## 🔍 Verificações adicionais:

### Se ainda der erro, verifique:
1. **Logs da Vercel**: Acesse o dashboard → Deployments → View Function Logs
2. **Conexão com banco**: Teste a `DATABASE_URL` diretamente
3. **Variáveis de ambiente**: Confirme se estão todas configuradas

### Comandos úteis para debug:
```bash
# Testar conexão local com PostgreSQL
npm run deploy-database

# Verificar se o build funciona localmente
npm run build

# Testar o servidor localmente
npm run start
```

## ⚠️ Importante:
- O banco PostgreSQL precisa ser inicializado após o primeiro deploy
- As tabelas serão criadas automaticamente pelo Prisma
- O usuário admin será criado automaticamente

## 🎯 Resultado esperado:
- Deploy bem-sucedido na Vercel
- Site funcionando sem erros de servidor
- Login funcionando: `admin@nonpc.network` / `admin123`
