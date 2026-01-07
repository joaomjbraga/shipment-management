# 🚚 Sistema de Gestão de Entregas (Shipment Management)

Sistema completo de gerenciamento de entregas desenvolvido em Node.js com TypeScript. Permite que vendedores gerenciem entregas e que clientes acompanhem o status de suas encomendas em tempo real.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Banco de Dados](#banco-de-dados)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Docker](#docker)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Rotas da API](#rotas-da-api)
- [Autenticação e Autorização](#autenticação-e-autorização)
- [Exemplos de Uso](#exemplos-de-uso)

---

## 📖 Sobre o Projeto

Este é um sistema RESTful de gestão de entregas que permite:

- **Cadastro e gerenciamento de usuários** (clientes e vendedores)
- **Criação e acompanhamento de entregas** com diferentes status
- **Sistema de logs** para histórico de mudanças de status
- **Autenticação baseada em JWT** (JSON Web Tokens)
- **Autorização por perfis** (customer e sale)

O sistema diferencia dois tipos de usuários:
- **Customer (Cliente)**: Pode criar entregas para si mesmo e visualizar logs
- **Sale (Vendedor)**: Pode gerenciar todas as entregas, criar logs e atualizar status

---

## 🛠 Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **TypeScript** - Superset JavaScript com tipagem estática
- **Express** - Framework web para Node.js
- **Prisma** - ORM moderno para Node.js e TypeScript
- **PostgreSQL** - Banco de dados relacional
- **Docker** - Containerização do banco de dados
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Criptografia de senhas
- **Zod** - Validação de schemas
- **tsx** - Execução de TypeScript em tempo de desenvolvimento

---

## ✨ Funcionalidades

- ✅ Cadastro e autenticação de usuários
- ✅ Gerenciamento de perfis (customer e sale)
- ✅ Criação de entregas
- ✅ Atualização de status de entregas (processing → shipped → delivered)
- ✅ Sistema de logs para rastreamento de mudanças
- ✅ Middlewares de autenticação e autorização
- ✅ Validação de dados com Zod
- ✅ Tratamento de erros centralizado

---

## 📁 Estrutura do Projeto

```
shipment-management/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── migrations/            # Migrações do banco
├── src/
│   ├── controllers/           # Lógica de negócio
│   │   ├── deliveries-controllers.ts
│   │   ├── deliveries-logs-controllers.ts
│   │   ├── deliveries-status-controllers.ts
│   │   ├── sessions-controllers.ts
│   │   └── users-controlles.ts
│   ├── middlewares/           # Middlewares da aplicação
│   │   ├── ensure-authenticated.ts
│   │   ├── error-handling.ts
│   │   └── verifyUserAuthorization.ts
│   ├── routes/                # Definição das rotas
│   │   ├── deliveries.route.ts
│   │   ├── deliveries.logs.route.ts
│   │   ├── sessions.routes.ts
│   │   ├── users.routes.ts
│   │   └── index.ts
│   ├── config/                # Configurações
│   │   └── auth.ts            # Configuração JWT
│   ├── utils/                 # Utilitários
│   │   ├── prisma.ts          # Cliente Prisma
│   │   └── AppError.ts        # Classe de erro customizada
│   ├── @types/                # Definições de tipos
│   ├── app.ts                 # Configuração do Express
│   └── server.ts              # Inicialização do servidor
├── generated/                 # Código gerado pelo Prisma
├── docker-compose.yml         # Configuração Docker
├── package.json
├── tsconfig.json
└── readme.md
```

---

## 🗄 Banco de Dados

O projeto utiliza **PostgreSQL** como banco de dados, gerenciado pelo **Prisma ORM**.

### Modelos de Dados

#### **Users (Usuários)**
Armazena informações dos usuários do sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (gerado automaticamente) |
| `name` | String | Nome do usuário |
| `email` | String | Email único do usuário |
| `password` | String | Senha criptografada com bcrypt |
| `role` | Enum | Perfil do usuário: `customer` ou `sale` (padrão: customer) |
| `created_at` | DateTime | Data de criação (automático) |
| `update_at` | DateTime | Data de atualização (automático) |

#### **Delivery (Entregas)**
Armazena informações das entregas cadastradas.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `user_id` | UUID | Referência ao usuário (cliente) |
| `description` | String | Descrição da entrega |
| `status` | Enum | Status: `processing`, `shipped` ou `delivered` (padrão: processing) |
| `created_at` | DateTime | Data de criação |
| `update_at` | DateTime | Data de atualização |

#### **DeliveryLog (Logs de Entrega)**
Armazena o histórico de mudanças de status das entregas.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `delivery_id` | UUID | Referência à entrega |
| `description` | String | Descrição da mudança (geralmente o status) |
| `created_at` | DateTime | Data de criação do log |

### Relacionamentos

- Um **Usuário** pode ter múltiplas **Entregas**
- Uma **Entrega** pertence a um **Usuário**
- Uma **Entrega** pode ter múltiplos **Logs**
- Um **Log** pertence a uma **Entrega**

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn** (gerenciador de pacotes)
- **Docker** e **Docker Compose** (para rodar o banco de dados)

Para verificar se você possui as ferramentas instaladas:

```bash
node --version
npm --version
docker --version
docker-compose --version
```

---

## ⚙️ Configuração do Ambiente

### 1. Clone o repositório

```bash
git clone https://github.com/joaomjbraga/shipment-management.git
cd shipment-management
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no arquivo `.env-examplo`:

```bash
cp .env-examplo .env
```

Edite o arquivo `.env` com as seguintes variáveis:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shipment-management?schema=public"
JWT_SECRET="seu-jwt-secret-super-seguro-aqui"
```

**Importante:**
- `DATABASE_URL`: String de conexão com o PostgreSQL. O formato é: `postgresql://usuário:senha@host:porta/nome-do-banco`
- `JWT_SECRET`: Chave secreta para assinar os tokens JWT. Use uma string aleatória e segura (recomendado: pelo menos 32 caracteres)

### 4. Gere o cliente Prisma

Após configurar o banco de dados, gere o cliente Prisma:

```bash
npx prisma generate
```

Este comando gera o cliente TypeScript baseado no schema do Prisma.

---

## 🐳 Docker

O projeto utiliza **Docker Compose** para facilitar o setup do banco de dados PostgreSQL.

### Arquivo `docker-compose.yml`

O arquivo `docker-compose.yml` configura um container PostgreSQL:

```yaml
services:
  postgres:
    image: "bitnami/postgresql:latest"
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=shipment-management
```

**Explicação:**
- **image**: Utiliza a imagem oficial Bitnami do PostgreSQL
- **ports**: Expõe a porta 5432 do container para a porta 5432 da máquina local
- **environment**: Define usuário, senha e nome do banco de dados

### Rodar o Docker

Para iniciar o banco de dados:

```bash
docker-compose up -d
```

O parâmetro `-d` roda o container em modo detached (background).

Para parar o container:

```bash
docker-compose down
```

Para ver os logs do container:

```bash
docker-compose logs -f postgres
```

---

## 🚀 Como Rodar o Projeto

### Passo a Passo

1. **Inicie o banco de dados com Docker:**

```bash
docker-compose up -d
```

2. **Execute as migrações do banco:**

```bash
npx prisma migrate dev
```

Este comando cria as tabelas no banco de dados baseado no schema Prisma.

3. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3333`

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo desenvolvimento com hot-reload (tsx watch)

### Verificando se está funcionando

Após iniciar o servidor, você verá a mensagem:
```
Servidor ON
```

---

## 🛣 Rotas da API

Todas as rotas estão prefixadas com a base URL: `http://localhost:3333`

### 🔐 Autenticação (`/sessions`)

#### `POST /sessions`
Realiza login e retorna token JWT.

**Autenticação:** Não requerida

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "usuario@example.com",
    "role": "customer",
    "created_at": "2024-01-01T00:00:00.000Z",
    "update_at": null
  }
}
```

---

### 👤 Usuários (`/users`)

#### `POST /users`
Cria um novo usuário.

**Autenticação:** Não requerida

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "customer",
  "created_at": "2024-01-01T00:00:00.000Z",
  "update_at": null
}
```

#### `GET /users`
Lista todos os usuários (somente vendedores).

**Autenticação:** Requerida (Bearer Token)

**Autorização:** Apenas usuários com role `sale`

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "customer",
    "created_at": "2024-01-01T00:00:00.000Z",
    "update_at": null
  }
]
```

#### `PUT /users/:id`
Atualiza um usuário.

**Autenticação:** Requerida (Bearer Token)

**Autorização:**
- Usuário pode atualizar seu próprio perfil
- Vendedores podem atualizar qualquer perfil

**Parâmetros de URL:**
- `id`: UUID do usuário

**Body (todos os campos opcionais):**
```json
{
  "name": "João Silva Atualizado",
  "email": "novoemail@example.com",
  "password": "novasenha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid",
  "name": "João Silva Atualizado",
  "email": "novoemail@example.com",
  "role": "customer",
  "created_at": "2024-01-01T00:00:00.000Z",
  "update_at": "2024-01-02T00:00:00.000Z"
}
```

#### `DELETE /users/:id`
Deleta um usuário.

**Autenticação:** Requerida (Bearer Token)

**Autorização:**
- Usuário pode deletar seu próprio perfil
- Vendedores podem deletar qualquer perfil

**Parâmetros de URL:**
- `id`: UUID do usuário

**Resposta de Sucesso (204):** Sem conteúdo

---

### 📦 Entregas (`/deliveries`)

**Todas as rotas de entregas requerem autenticação e autorização de vendedor (`sale`).**

#### `POST /deliveries`
Cria uma nova entrega.

**Autenticação:** Requerida (Bearer Token)

**Autorização:** Apenas usuários com role `sale`

**Body:**
```json
{
  "user_id": "uuid-do-cliente",
  "description": "Pacote contendo livros"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": "uuid",
  "userID": "uuid-do-cliente",
  "description": "Pacote contendo livros",
  "status": "processing",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updateAt": null
}
```

#### `GET /deliveries`
Lista todas as entregas.

**Autenticação:** Requerida (Bearer Token)

**Autorização:** Apenas usuários com role `sale`

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "uuid",
    "userID": "uuid-do-cliente",
    "description": "Pacote contendo livros",
    "status": "processing",
    "user": {
      "name": "João Silva",
      "email": "joao@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updateAt": null
  }
]
```

#### `PATCH /deliveries/:id/status`
Atualiza o status de uma entrega.

**Autenticação:** Requerida (Bearer Token)

**Autorização:** Apenas usuários com role `sale`

**Parâmetros de URL:**
- `id`: UUID da entrega

**Body:**
```json
{
  "status": "shipped"
}
```

**Valores permitidos para status:**
- `processing` - Em processamento
- `shipped` - Enviado
- `delivered` - Entregue

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid",
  "userID": "uuid-do-cliente",
  "description": "Pacote contendo livros",
  "status": "shipped",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updateAt": "2024-01-02T00:00:00.000Z"
}
```

**Nota:** Esta rota automaticamente cria um log no sistema quando o status é atualizado.

---

### 📋 Logs de Entrega (`/deliveries-logs`)

#### `POST /deliveries-logs`
Cria um novo log para uma entrega.

**Autenticação:** Requerida (Bearer Token)

**Autorização:** Apenas usuários com role `sale`

**Body:**
```json
{
  "delivery_id": "uuid-da-entrega",
  "description": "Pacote saiu do centro de distribuição"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": "uuid",
  "deliveryId": "uuid-da-entrega",
  "description": "Pacote saiu do centro de distribuição",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### `GET /deliveries-logs/:deliveries_id/show`
Lista todos os logs de uma entrega específica.

**Autenticação:** Requerida (Bearer Token)

**Autorização:** Usuários com role `sale` ou `customer`

**Parâmetros de URL:**
- `deliveries_id`: UUID da entrega

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "uuid",
    "deliveryId": "uuid-da-entrega",
    "description": "processing",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "uuid",
    "deliveryId": "uuid-da-entrega",
    "description": "shipped",
    "createdAt": "2024-01-02T00:00:00.000Z"
  }
]
```

---

## 🔒 Autenticação e Autorização

### Como funciona

1. **Login**: O usuário faz login através de `POST /sessions` fornecendo email e senha
2. **Token**: O sistema retorna um JWT token válido por 1 dia
3. **Uso**: O token deve ser enviado no header `Authorization` no formato: `Bearer <token>`

### Exemplo de uso do token

```bash
curl -X GET http://localhost:3333/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Perfis de Usuário

#### **Customer (Cliente)**
- Pode criar seu próprio usuário
- Pode atualizar seu próprio perfil
- Pode deletar seu próprio perfil
- Pode visualizar logs de entregas relacionadas a ele

#### **Sale (Vendedor)**
- Pode criar usuários
- Pode listar todos os usuários
- Pode atualizar qualquer usuário
- Pode deletar qualquer usuário
- Pode criar entregas
- Pode listar todas as entregas
- Pode atualizar status de entregas
- Pode criar logs de entregas
- Pode visualizar logs de qualquer entrega

---

## 📝 Exemplos de Uso

### 1. Criar um usuário cliente

```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@example.com",
    "password": "senha123"
  }'
```

### 2. Fazer login

```bash
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "senha123"
  }'
```

**Salve o token retornado para usar nas próximas requisições.**

### 3. Criar uma entrega (como vendedor)

```bash
curl -X POST http://localhost:3333/deliveries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "user_id": "uuid-do-cliente",
    "description": "Notebook Dell Inspiron 15"
  }'
```

### 4. Atualizar status de uma entrega

```bash
curl -X PATCH http://localhost:3333/deliveries/<uuid-da-entrega>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "status": "shipped"
  }'
```

### 5. Visualizar logs de uma entrega

```bash
curl -X GET http://localhost:3333/deliveries-logs/<uuid-da-entrega>/show \
  -H "Authorization: Bearer <seu-token>"
```

---

## 🔍 Comandos Úteis do Prisma

### Visualizar o banco de dados

```bash
npx prisma studio
```

Abre uma interface web para visualizar e editar dados do banco.

### Criar nova migração

```bash
npx prisma migrate dev --name nome_da_migracao
```

### Aplicar migrações em produção

```bash
npx prisma migrate deploy
```

### Resetar o banco de dados (⚠️ CUIDADO: apaga todos os dados)

```bash
npx prisma migrate reset
```

---

## 📚 Estrutura de Código

### Middlewares

- **ensure-authenticated.ts**: Verifica se o usuário está autenticado (tem token válido)
- **verifyUserAuthorization.ts**: Verifica se o usuário tem permissão (role) para acessar a rota
- **error-handling.ts**: Trata erros de forma centralizada

### Controllers

Cada controller é responsável por uma entidade específica e contém os métodos:
- Create (POST)
- Index (GET - listar)
- Update/Upgrade (PUT/PATCH)
- Delete (DELETE)

---

## ⚠️ Tratamento de Erros

O sistema possui tratamento de erros centralizado. Erros comuns:

- **401 Unauthorized**: Token ausente ou inválido
- **403 Forbidden**: Usuário não tem permissão para a ação
- **404 Not Found**: Recurso não encontrado
- **400 Bad Request**: Dados inválidos ou faltando na requisição

---

## 🧪 Próximos Passos

Para testar a API, você pode usar:

- **Postman**: Interface gráfica para testar APIs
- **Insomnia**: Alternativa ao Postman
- **cURL**: Linha de comando (exemplos acima)
- **Thunder Client**: Extensão do VS Code

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👤 Autor

**João M J Braga**

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

**Desenvolvido com ❤️ usando TypeScript e Node.js**

