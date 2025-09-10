# 🔐 Como Alterar a Senha do Admin

## ✅ Script Criado:
- **Arquivo**: `scripts/change-admin-password.ts`
- **Comando**: `npm run change-admin-password`

## 🚀 Como Usar:

### 1. **Execute o comando**:
```bash
npm run change-admin-password
```

### 2. **Siga as instruções**:
- Digite a nova senha
- Confirme a nova senha
- A senha será alterada automaticamente

### 3. **Resultado**:
```
🔐 Alterando senha do usuário admin...
✅ Usuário admin encontrado: admin
Digite a nova senha: [sua nova senha]
Confirme a nova senha: [sua nova senha]
✅ Senha alterada com sucesso!
📧 Email: admin@nonpc.network
🔑 Nova senha: [sua nova senha]
```

## 🔒 Segurança:

### ✅ **Vantagens**:
- **Criptografia automática** (bcrypt)
- **Validação de senha** (mínimo 3 caracteres)
- **Confirmação de senha**
- **Sem acesso direto ao banco**

### ⚠️ **Requisitos**:
- Senha deve ter pelo menos 3 caracteres
- Senhas devem coincidir
- Usuário admin deve existir

## 🎯 Exemplo de Uso:

```bash
PS E:\Users\Felipe\Downloads\npcnetwork> npm run change-admin-password

> my-v0-project@0.1.0 change-admin-password
> tsx scripts/change-admin-password.ts

🔐 Alterando senha do usuário admin...
✅ Usuário admin encontrado: admin
Digite a nova senha: minhaNovaSenha123
Confirme a nova senha: minhaNovaSenha123
✅ Senha alterada com sucesso!
📧 Email: admin@nonpc.network
🔑 Nova senha: minhaNovaSenha123
```

## 🔄 Para Produção:

### **Local** (desenvolvimento):
```bash
npm run change-admin-password
```

### **Produção** (Vercel):
1. Execute o comando localmente
2. A senha será alterada no banco PostgreSQL da Vercel
3. Faça login com a nova senha

## 💡 Dicas:

### **Senhas Seguras**:
- Use pelo menos 8 caracteres
- Combine letras, números e símbolos
- Evite senhas óbvias

### **Exemplos de Senhas**:
- ✅ `admin2024!`
- ✅ `NoNpcNetwork123`
- ✅ `RacingCrew2024`
- ❌ `123`
- ❌ `admin`

## 🆘 Se Der Erro:

### **Usuário não encontrado**:
- Execute `npm run deploy-database` primeiro
- Verifique se o admin existe

### **Erro de conexão**:
- Verifique se a `DATABASE_URL` está correta
- Teste com `npm run test-connection`

## ✅ Resultado:

Após alterar a senha:
- **Login**: `admin@nonpc.network`
- **Nova senha**: A que você definiu
- **Funciona**: Imediatamente no site

**Agora você pode alterar a senha do admin facilmente!** 🔐
