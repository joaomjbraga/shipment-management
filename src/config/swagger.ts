import swaggerJsdoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shipment Management API',
      version: '1.0.0',
      description: 'Sistema de gerenciamento de entregas desenvolvido em Node.js com TypeScript',
      contact: {
        name: 'João M J Braga',
      },
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido através do endpoint /sessions',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Identificador único do usuário',
            },
            name: {
              type: 'string',
              description: 'Nome completo do usuário',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único do usuário',
            },
            role: {
              type: 'string',
              enum: ['customer', 'sale'],
              description: 'Perfil do usuário: customer (cliente) ou sale (vendedor)',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do usuário',
            },
            update_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Data da última atualização',
            },
          },
        },

        CreateUserInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'senha123',
            },
          },
        },

        UpdateUserInput: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'João Silva Atualizado',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'novoemail@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'novasenha123',
            },
          },
        },

        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'usuario@example.com',
            },
            password: {
              type: 'string',
              example: 'senha123',
            },
          },
        },

        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token JWT para autenticação',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },

        Delivery: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Identificador único da entrega',
            },
            userID: {
              type: 'string',
              format: 'uuid',
              description: 'ID do cliente que receberá a entrega',
            },
            description: {
              type: 'string',
              description: 'Descrição do conteúdo da entrega',
            },
            status: {
              type: 'string',
              enum: ['processing', 'shipped', 'delivered'],
              description: 'Status atual da entrega',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação da entrega',
            },
            updateAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Data da última atualização',
            },
          },
        },

        DeliveryWithUser: {
          allOf: [
            { $ref: '#/components/schemas/Delivery' },
            {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                  },
                },
              },
            },
          ],
        },

        CreateDeliveryInput: {
          type: 'object',
          required: ['user_id', 'description'],
          properties: {
            user_id: {
              type: 'string',
              format: 'uuid',
              example: 'uuid-do-cliente',
            },
            description: {
              type: 'string',
              example: 'Pacote contendo livros',
            },
          },
        },

        UpdateDeliveryStatusInput: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['processing', 'shipped', 'delivered'],
              example: 'shipped',
            },
          },
        },

        DeliveryLog: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Identificador único do log',
            },
            deliveryId: {
              type: 'string',
              format: 'uuid',
              description: 'ID da entrega relacionada',
            },
            description: {
              type: 'string',
              description: 'Descrição da mudança de status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do log',
            },
          },
        },

        CreateDeliveryLogInput: {
          type: 'object',
          required: ['delivery_id', 'description'],
          properties: {
            delivery_id: {
              type: 'string',
              format: 'uuid',
              example: 'uuid-da-entrega',
            },
            description: {
              type: 'string',
              example: 'Pacote saiu do centro de distribuição',
            },
          },
        },

        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro',
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Token ausente ou inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Token inválido',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Usuário não tem permissão para esta ação',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Acesso negado',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Recurso não encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Recurso não encontrado',
              },
            },
          },
        },
        BadRequestError: {
          description: 'Dados inválidos ou faltando',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Dados inválidos',
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Autenticação',
        description: 'Endpoints para login e autenticação',
      },
      {
        name: 'Usuários',
        description: 'Gerenciamento de usuários (clientes e vendedores)',
      },
      {
        name: 'Entregas',
        description: 'Gerenciamento de entregas (apenas vendedores)',
      },
      {
        name: 'Logs de Entrega',
        description: 'Histórico de mudanças de status das entregas',
      },
    ],
    paths: {
      '/sessions': {
        post: {
          tags: ['Autenticação'],
          summary: 'Realizar login',
          description: 'Autentica o usuário e retorna um token JWT válido por 1 dia',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginInput',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Login realizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/LoginResponse',
                  },
                },
              },
            },
            '400': {
              $ref: '#/components/responses/BadRequestError',
            },
            '401': {
              description: 'Credenciais inválidas',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                  example: {
                    message: 'Email ou senha incorretos',
                  },
                },
              },
            },
          },
        },
      },

      '/users': {
        post: {
          tags: ['Usuários'],
          summary: 'Criar novo usuário',
          description: 'Cria um novo usuário com perfil customer (cliente) por padrão',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateUserInput',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Usuário criado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
            '400': {
              $ref: '#/components/responses/BadRequestError',
            },
          },
        },
        get: {
          tags: ['Usuários'],
          summary: 'Listar todos os usuários',
          description: 'Retorna a lista de todos os usuários cadastrados (apenas vendedores)',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Lista de usuários',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
              },
            },
            '401': {
              $ref: '#/components/responses/UnauthorizedError',
            },
            '403': {
              $ref: '#/components/responses/ForbiddenError',
            },
          },
        },
      },

      '/users/{id}': {
        put: {
          tags: ['Usuários'],
          summary: 'Atualizar usuário',
          description: 'Atualiza os dados de um usuário. Usuários podem atualizar seu próprio perfil. Vendedores podem atualizar qualquer perfil.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid',
              },
              description: 'UUID do usuário',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UpdateUserInput',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Usuário atualizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
            '400': {
              $ref: '#/components/responses/BadRequestError',
            },
            '401': {
              $ref: '#/components/responses/UnauthorizedError',
            },
            '403': {
              $ref: '#/components/responses/ForbiddenError',
            },
            '404': {
              $ref: '#/components/responses/NotFoundError',
            },
          },
        },
        delete: {
          tags: ['Usuários'],
          summary: 'Deletar usuário',
          description: 'Remove um usuário do sistema. Usuários podem deletar seu próprio perfil. Vendedores podem deletar qualquer perfil.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid',
              },
              description: 'UUID do usuário',
            },
          ],
          responses: {
            '204': {
              description: 'Usuário deletado com sucesso',
            },
            '401': {
              $ref: '#/components/responses/UnauthorizedError',
            },
            '403': {
              $ref: '#/components/responses/ForbiddenError',
            },
            '404': {
              $ref: '#/components/responses/NotFoundError',
            },
          },
        },
      },

      '/deliveries': {
        post: {
          tags: ['Entregas'],
          summary: 'Criar nova entrega',
          description: 'Cria uma nova entrega com status "processing" (apenas vendedores)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateDeliveryInput',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Entrega criada com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Delivery',
                  },
                },
              },
            },
            '400': {
              $ref: '#/components/responses/BadRequestError',
            },
            '401': {
              $ref: '#/components/responses/UnauthorizedError',
            },
            '403': {
              $ref: '#/components/responses/ForbiddenError',
            },
          },
        },
        get: {
          tags: ['Entregas'],
          summary: 'Listar todas as entregas',
          description: 'Retorna a lista de todas as entregas com informações do cliente (apenas vendedores)',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Lista de entregas',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/DeliveryWithUser',
                    },
                  },
                },
              },
            },
            '401': {
              $ref: '#/components/responses/UnauthorizedError',
            },
            '403': {
              $ref: '#/components/responses/ForbiddenError',
            },
          },
        },
      },

      '/deliveries/{id}/status': {
        patch: {
          tags: ['Entregas'],
          summary: 'Atualizar status da entrega',
          description: 'Atualiza o status de uma entrega e cria automaticamente um log (apenas vendedores). Status: processing → shipped → delivered',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid',
              },
              description: 'UUID da entrega',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UpdateDeliveryStatusInput',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Status atualizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Delivery',
                  },
                },
              },
            },
            '400': {
              $ref: '#/components/responses/BadRequestError',
            },
            '401': {
              $ref: '#/components/responses/UnauthorizedError',
            },
            '403': {
              $ref: '#/components/responses/ForbiddenError',
            },
            '404': {
              $ref: '#/components/responses/NotFoundError',
            },
          },
        },
      },

      '/deliveries-logs': {
        post: {
          tags: ['Logs de Entrega'],
          summary: 'Criar log de entrega',
          description: 'Cria um novo log para registrar uma mudança ou atualização na entrega (apenas vendedores)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateDeliveryLogInput',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Log criado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/DeliveryLog',
                  },
                },
              },
            },
            '400': {
              $ref: '#/components/responses/BadRequestError',
            },
            '401': {
              $ref: '#/components/responses/UnauthorizedError',
            },
            '403': {
              $ref: '#/components/responses/ForbiddenError',
            },
          },
        },
      },

      '/deliveries-logs/{deliveries_id}/show': {
        get: {
          tags: ['Logs de Entrega'],
          summary: 'Listar logs de uma entrega',
          description: 'Retorna todos os logs de histórico de uma entrega específica (vendedores e clientes)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'deliveries_id',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid',
              },
              description: 'UUID da entrega',
            },
          ],
          responses: {
            '200': {
              description: 'Lista de logs da entrega',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/DeliveryLog',
                    },
                  },
                },
              },
            },
            '401': {
              $ref: '#/components/responses/UnauthorizedError',
            },
            '404': {
              $ref: '#/components/responses/NotFoundError',
            },
          },
        },
      },
    },
  },
  apis: ['src/routes/**/*.ts'],
})
