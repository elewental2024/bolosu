# Bolos Su - E-commerce de Bolos Artesanais 🍰

Sistema completo de vendas de bolos online com área do cliente e painel administrativo.

## 🚀 Funcionalidades

### Área do Cliente
- ✅ Autenticação com WhatsApp e CPF
- ✅ Catálogo de produtos com imagens
- ✅ Carrinho de compras
- ✅ Sistema de pedidos
- ✅ Acompanhamento de status em tempo real
- ✅ Chat direto com a vendedora
- ✅ Histórico de pedidos

### Painel Administrativo
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento completo de pedidos
- ✅ Alterar status dos pedidos
- ✅ Definir taxa de entrega
- ✅ Chat com clientes
- ✅ Cadastro e edição de produtos
- ✅ Ativar/desativar produtos
- ✅ Busca e filtros de pedidos

## 🛠️ Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados (desenvolvimento)
- **NextAuth.js** - Autenticação
- **Zod** - Validação de dados

## 📋 Pré-requisitos

- Node.js 18+ instalado
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
# O arquivo .env já está configurado com valores padrão
# Para produção, altere NEXTAUTH_SECRET e NEXTAUTH_URL
```

4. Inicialize o banco de dados:
```bash
npm run db:push
```

5. Popule o banco com dados iniciais:
```bash
npm run db:seed
```

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

7. Acesse no navegador:
```
http://localhost:3000
```

## 👥 Usuários de Teste

### Administrador (sua mãe)
- **WhatsApp:** 5511999999999
- **CPF:** 123.456.789-00

### Cliente de Teste
- **WhatsApp:** 5511988888888
- **CPF:** 987.654.321-00

## 📱 Como Usar

### Como Cliente

1. **Cadastro/Login:**
   - Acesse `/login` ou `/register`
   - Informe seu WhatsApp e CPF
   - Para novos usuários, informe também o nome

2. **Fazer um Pedido:**
   - Navegue em `/produtos`
   - Adicione bolos ao carrinho
   - Clique em "Fazer Pedido"
   - Preencha endereço e data de entrega
   - Confirme o pedido

3. **Acompanhar Pedidos:**
   - Acesse `/pedidos` para ver todos os seus pedidos
   - Clique em um pedido para ver detalhes
   - Use o chat para falar com a vendedora

### Como Administrador

1. **Acesso:**
   - Faça login com credenciais de admin
   - Acesse o painel em `/admin/dashboard`

2. **Gerenciar Pedidos:**
   - Veja todos os pedidos em `/admin/pedidos`
   - Filtre por status ou busque por cliente
   - Clique em um pedido para gerenciá-lo
   - Altere o status conforme o progresso
   - Defina a taxa de entrega
   - Converse com o cliente pelo chat

3. **Gerenciar Produtos:**
   - Acesse `/admin/produtos`
   - Clique em "Novo Produto" para adicionar
   - Informe nome, descrição, preço e URL do Instagram
   - Edite ou ative/desative produtos existentes

4. **Chat com Clientes:**
   - Acesse `/admin/chats` para ver conversas ativas
   - Clique em uma conversa para responder

## 🗂️ Estrutura do Projeto

```
bolosu/
├── app/                    # Páginas e rotas
│   ├── (auth)/            # Páginas de autenticação
│   │   ├── login/
│   │   └── register/
│   ├── produtos/          # Catálogo de produtos
│   ├── pedidos/           # Pedidos do cliente
│   │   ├── novo/         # Checkout
│   │   └── [id]/         # Detalhes do pedido
│   ├── admin/             # Painel administrativo
│   │   ├── dashboard/    # Dashboard
│   │   ├── pedidos/      # Gerenciar pedidos
│   │   ├── produtos/     # Gerenciar produtos
│   │   └── chats/        # Conversas
│   └── api/               # API Routes
│       ├── auth/         # Autenticação
│       ├── products/     # Produtos
│       ├── orders/       # Pedidos
│       └── messages/     # Mensagens
├── components/            # Componentes React
│   ├── ui/               # Componentes UI reutilizáveis
│   ├── client/           # Componentes do cliente
│   └── admin/            # Componentes do admin
├── lib/                   # Utilitários e configurações
│   ├── prisma.ts         # Cliente Prisma
│   ├── auth.ts           # Configuração NextAuth
│   ├── utils.ts          # Funções utilitárias
│   └── validations.ts    # Schemas de validação
├── prisma/               # Banco de dados
│   ├── schema.prisma     # Schema do banco
│   └── seed.ts           # Dados iniciais
└── public/               # Arquivos estáticos
```

## 🎨 Design

O sistema utiliza uma paleta de cores suave e acolhedora:
- **Primary (Rosa):** Para ações principais e destaques
- **Beige:** Para backgrounds e elementos secundários
- **Cinza:** Para textos e bordas

## 🔐 Segurança

- Validação de CPF no frontend e backend
- Proteção de rotas com middleware NextAuth
- Sanitização de inputs
- Autenticação baseada em JWT
- Separação de permissões (cliente/admin)

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa ESLint
npm run db:push      # Sincroniza schema com banco
npm run db:seed      # Popula banco com dados iniciais
```

## 🚀 Deploy em Produção

### Preparação

1. Atualize variáveis de ambiente:
```env
DATABASE_URL="postgresql://..."  # Use PostgreSQL em produção
NEXTAUTH_SECRET="gere-um-segredo-forte"
NEXTAUTH_URL="https://seu-dominio.com"
```

2. Migre para PostgreSQL:
```bash
# Atualize prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Execute as migrations:
```bash
npx prisma migrate dev
npm run db:seed
```

### Deploy (Vercel)

1. Instale Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configure as variáveis de ambiente no dashboard da Vercel

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto é privado e de uso exclusivo.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através do WhatsApp cadastrado no sistema.

---

Desenvolvido com ❤️ para Bolos Su
