# 🎂 Bolos Su - E-Commerce de Bolos

Sistema completo de vendas de bolos online com área do cliente e painel administrativo.

## 🚀 Tecnologias

- **Next.js 14** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **Prisma** como ORM
- **SQLite** para desenvolvimento (pronto para PostgreSQL em produção)
- **React Hook Form** para gerenciamento de formulários
- **Zod** para validação de dados

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/elewental2024/bolosu.git
cd bolosu
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# O arquivo .env já está configurado para desenvolvimento
# DATABASE_URL="file:./dev.db"
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
```

4. Execute as migrations do banco de dados:
```bash
npx prisma migrate dev
```

5. Popule o banco com dados iniciais:
```bash
npm run db:seed
```

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

7. Acesse http://localhost:3000

## 👥 Usuários de Teste

Após executar o seed, você terá:

### Administrador
- **CPF:** 111.444.777-35
- **WhatsApp:** (11) 99999-9999
- **Nome:** Administrador

### Cliente de Teste
- **CPF:** 782.924.503-78
- **WhatsApp:** (11) 98888-8888
- **Nome:** Cliente Teste

## 📱 Funcionalidades

### Área do Cliente
- ✅ Cadastro e login com WhatsApp e CPF
- ✅ Catálogo de produtos com imagens
- ✅ Carrinho de compras
- ✅ Formulário de pedido com endereço e data de entrega
- ✅ Histórico de pedidos
- ✅ Chat com a vendedora por pedido

### Painel Administrativo
- ✅ Dashboard com todos os pedidos
- ✅ Filtros por status e busca por cliente
- ✅ Detalhes completos de cada pedido
- ✅ Atualização de status do pedido
- ✅ Definição de taxa de entrega e preço total
- ✅ Gerenciamento de produtos (CRUD)
- ✅ Sistema de chat com clientes
- ✅ Lista de conversas ativas

## 🗂️ Estrutura do Projeto

```
bolosu/
├── app/                          # Páginas e rotas da aplicação
│   ├── api/                      # API routes
│   │   ├── auth/                 # Autenticação
│   │   ├── products/             # Produtos
│   │   ├── orders/               # Pedidos
│   │   └── messages/             # Mensagens do chat
│   ├── admin/                    # Painel administrativo
│   │   ├── dashboard/            # Dashboard de pedidos
│   │   ├── pedidos/              # Gerenciamento de pedidos
│   │   ├── produtos/             # Gerenciamento de produtos
│   │   └── chat/                 # Chat com clientes
│   ├── produtos/                 # Catálogo de produtos
│   ├── pedidos/                  # Histórico e novo pedido
│   ├── chat/                     # Chat do cliente
│   ├── login/                    # Página de login
│   └── register/                 # Página de cadastro
├── components/                   # Componentes reutilizáveis
│   ├── ui/                       # Componentes de UI
│   ├── client/                   # Componentes da área do cliente
│   └── admin/                    # Componentes do painel admin
├── lib/                          # Bibliotecas e utilitários
│   ├── prisma.ts                 # Cliente Prisma
│   ├── auth.ts                   # Funções de autenticação
│   └── utils.ts                  # Funções utilitárias
├── prisma/                       # Schema e migrations
│   ├── schema.prisma             # Schema do banco de dados
│   └── seed.js                   # Dados iniciais
└── public/                       # Arquivos estáticos
```

## 🎨 Status dos Pedidos

- **pending** (Pendente) - Pedido recebido, aguardando confirmação
- **confirmed** (Confirmado) - Pedido confirmado pela vendedora
- **preparing** (Em Preparo) - Bolo sendo preparado
- **ready** (Pronto para Entrega) - Bolo pronto, aguardando entrega
- **delivered** (Entregue) - Pedido entregue ao cliente
- **cancelled** (Cancelado) - Pedido cancelado

## 🔐 Autenticação

O sistema usa autenticação simplificada com:
- **WhatsApp** (número único por usuário)
- **CPF** (validado no frontend e backend)

Não há senhas. A combinação de WhatsApp + CPF identifica o usuário de forma única.

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Build para produção
npm start            # Inicia o servidor de produção
npm run db:migrate   # Executa migrations do Prisma
npm run db:push      # Sincroniza schema com o banco
npm run db:seed      # Popula o banco com dados iniciais
```

## 📦 Banco de Dados

O projeto usa **SQLite** para desenvolvimento, mas está preparado para migrar para **PostgreSQL** em produção.

### Schema Principal

- **User** - Usuários (clientes e admin)
- **Product** - Produtos (bolos)
- **Order** - Pedidos
- **OrderItem** - Itens dos pedidos
- **Message** - Mensagens do chat

## 🌐 Deploy em Produção

1. Configure as variáveis de ambiente para produção:
```bash
DATABASE_URL="postgresql://..." # PostgreSQL connection string
NEXTAUTH_URL="https://seu-dominio.com"
NEXTAUTH_SECRET="generate-a-secure-secret"
```

2. Execute o build:
```bash
npm run build
```

3. Execute as migrations:
```bash
npx prisma migrate deploy
```

4. Inicie o servidor:
```bash
npm start
```

## 📝 Validações

- **CPF**: Validação completa do algoritmo de CPF brasileiro
- **WhatsApp**: Formatação automática para padrão brasileiro
- **Formulários**: Validação em tempo real com feedback visual

## 🎯 Próximas Melhorias

- [ ] Integração real com Instagram oEmbed API
- [ ] Integração com WhatsApp Business API
- [ ] Notificações por email
- [ ] Sistema de avaliações de produtos
- [ ] Cupons de desconto
- [ ] Relatórios de vendas
- [ ] Upload de imagens de produtos
- [ ] Pagamento online

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👩‍💼 Autora

Desenvolvido para Bolos Su - Os melhores bolos artesanais da região! 🎂

---

**Made with ❤️ and Next.js**
