import { app } from '@/app.js'
import { prisma } from '@/utils/prisma.js'
import request from 'supertest'
import { afterAll, describe, expect, it } from 'vitest'

describe('Teste de Usuários', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('deve criar e deletar um usuário', async () => {
    const createResponse = await request(app)
      .post('/users')
      .send({
        name: 'Teste Usuário',
        email: 'teste@exemplo.com',
        password: 'senha123'
      })

    expect(createResponse.status).toBe(201)
    expect(createResponse.body.name).toBe('Teste Usuário')
    expect(createResponse.body.email).toBe('teste@exemplo.com')
    expect(createResponse.body).not.toHaveProperty('password')

    const userId = createResponse.body.id

    await prisma.users.delete({
      where: { id: userId }
    })

    const userExists = await prisma.users.findUnique({
      where: { id: userId }
    })
    expect(userExists).toBeNull()
  })
})
