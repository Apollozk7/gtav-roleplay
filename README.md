# NO NPC NETWORK - Sistema de Corrida Clandestina

Um sistema completo de gerenciamento para um coletivo de corrida clandestina em ambiente de roleplay GTA V.

## 🚀 Funcionalidades

### Sistema de Autenticação
- **Admin**: Acesso total ao sistema (criar/editar/excluir eventos, gerenciar apostas, usuários e serviços)
- **Usuário**: Visualização de eventos e apostas, acesso aos serviços

### Gerenciamento de Eventos
- Criação de corridas, encontros, circuitos e arrancadas
- Sistema de revelação de localização em horário específico
- Gerenciamento de participantes com odds
- Status de eventos (Planejado, Ativo, Concluído, Cancelado)

### Sistema de Apostas
- Apostas em participantes de eventos
- Upload de comprovante de pagamento via catbox.moe
- Cálculo automático de ganhos potenciais
- Gerenciamento de status das apostas (Pendente, Confirmada, Paga, Cancelada)

### Serviços
- Catálogo de serviços (Transporte, Roubo, Distração, Outros)
- Preços e descrições detalhadas
- Sistema de solicitação de serviços

### Painel Administrativo
- Gerenciamento completo de eventos
- Controle de apostas e usuários
- Administração de serviços
- Estatísticas e relatórios

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Banco de Dados**: SQLite com Prisma ORM
- **Autenticação**: NextAuth.js
- **UI**: Tailwind CSS, Radix UI, shadcn/ui
- **Estilização**: Tema cyberpunk/terminal

## 🌐 Deploy Online

Para que seus amigos possam acessar o site, você pode fazer deploy gratuito:

### Opção 1: Vercel (Recomendado)
1. Acesse [vercel.com](https://vercel.com)
2. Conecte com GitHub e importe o projeto
3. Configure as variáveis de ambiente
4. Deploy automático!

### Opção 2: Netlify
1. Acesse [netlify.com](https://netlify.com)
2. Conecte com GitHub ou faça upload
3. Configure as variáveis de ambiente

### Opção 3: Túnel Local (Testes)
```bash
# Instale o ngrok
npm install -g ngrok

# Execute o túnel
ngrok http 3000
```

📖 **Guia completo de deploy:** Veja o arquivo `DEPLOY_GUIDE.md`

## 📦 Instalação Local

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd npcnetwork
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
npx prisma generate
npx prisma db push
```

4. **Crie o usuário admin**
```bash
npx tsx scripts/create-admin.ts
```

5. **Popule com dados iniciais (opcional)**
```bash
npx tsx scripts/seed-data.ts
```

6. **Execute o servidor**
```bash
npm run dev
```

## 🔐 Credenciais Padrão

**Admin:**
- Email: `admin@npcnetwork.com`
- Senha: `admin123`

## 📱 Como Usar

### Para Administradores

1. **Acesse o painel admin** através do botão [ADMIN] no header
2. **Crie eventos** na aba "Eventos":
   - Defina título, descrição e tipo
   - Configure localização (pode ser revelada em horário específico)
   - Adicione participantes com odds
3. **Gerencie apostas** na aba "Apostas":
   - Visualize todas as apostas
   - Confirme ou cancele apostas
   - Marque como pagas quando necessário
4. **Configure serviços** na aba "Serviços":
   - Adicione novos serviços
   - Defina preços e descrições
   - Ative/desative conforme necessário

### Para Usuários

1. **Visualize eventos** na seção "Operações"
2. **Faça apostas** na seção "Apostas":
   - Selecione evento e participante
   - Defina valor da aposta
   - Envie comprovante de pagamento
3. **Explore serviços** na seção "Serviços"
4. **Acompanhe suas apostas** na seção de apostas ativas

## 🎨 Temas e Estilização

O sistema utiliza um tema cyberpunk/terminal com:
- Cores escuras e neon
- Fontes monospace
- Efeitos de glitch e matrix
- Interface estilo terminal
- Animações e transições suaves

## 🔧 Configuração Avançada

### Variáveis de Ambiente

Crie um arquivo `.env.local`:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
```

### Personalização

- **Cores**: Edite `app/globals.css` para personalizar o tema
- **Componentes**: Modifique componentes em `components/`
- **APIs**: Ajuste rotas em `app/api/`
- **Banco**: Modifique schema em `prisma/schema.prisma`

## 📊 Estrutura do Banco

- **Users**: Usuários do sistema (admin/usuário)
- **Events**: Eventos (corridas, encontros, etc.)
- **EventParticipants**: Participantes dos eventos
- **Bets**: Apostas dos usuários
- **Services**: Catálogo de serviços

## 🚨 Segurança

- Autenticação obrigatória para todas as rotas
- Middleware de proteção para rotas admin
- Validação de dados em todas as APIs
- Hash de senhas com bcrypt
- Proteção contra CSRF

## 🎮 Integração com GTA V

Este sistema foi projetado para funcionar como:
- **Website de roleplay** para servidores GTA V
- **Sistema de apostas** para corridas
- **Plataforma de serviços** para crews
- **Interface administrativa** para organizadores

## 📝 Licença

Este projeto é para uso educacional e de roleplay apenas.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Entre em contato via canais criptografados (roleplay)

---

**AVISO LEGAL**: Este é um sistema de roleplay para entretenimento em servidores GTA V apenas. Não promove atividades ilegais reais.


