import { app } from '@/app.js'
import { prisma } from '@/utils/prisma.js'
import { hash } from 'bcrypt'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Testes de Usuários', () => {
  let saleToken: string
  let customerToken: string
  let customerId: string

  beforeAll(async () => {
    await prisma.users.deleteMany({
      where: { email: { contains: '@teste.com' } }
    })

    const sale = await prisma.users.create({
      data: {
        name: 'Vendedor',
        email: 'vendedor@teste.com',
        password: await hash('senha123', 8),
        role: 'sale'
      }
    })

    const customer = await prisma.users.create({
      data: {
        name: 'Cliente',
        email: 'cliente@teste.com',
        password: await hash('senha123', 8),
        role: 'customer'
      }
    })
    customerId = customer.id

    const saleLogin = await request(app)
      .post('/sessions')
      .send({ email: 'vendedor@teste.com', password: 'senha123' })
    saleToken = saleLogin.body.token

    const customerLogin = await request(app)
      .post('/sessions')
      .send({ email: 'cliente@teste.com', password: 'senha123' })
    customerToken = customerLogin.body.token
  })

  afterAll(async () => {
    await prisma.users.deleteMany({
      where: { email: { contains: '@teste.com' } }
    })
    await prisma.$disconnect()
  })

  describe('POST /users - Criar usuário', () => {
    it('deve criar um novo usuário', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'João Silva',
          email: 'joao@teste.com',
          password: 'senha123'
        })

      expect(response.status).toBe(201)
      expect(response.body.name).toBe('João Silva')
      expect(response.body.email).toBe('joao@teste.com')
      expect(response.body).not.toHaveProperty('password')

      await prisma.users.delete({ where: { email: 'joao@teste.com' } })
    })

    it('não deve criar usuário com email duplicado', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'Outro',
          email: 'cliente@teste.com',
          password: 'senha123'
        })

      expect(response.status).toBe(400)
    })

    it('deve validar campos obrigatórios', async () => {
      const response = await request(app)
        .post('/users')
        .send({ name: 'Teste' })

      expect(response.status).toBe(400)
    })
  })

  describe('GET /users - Listar usuários', () => {
    it('deve listar usuários quando autenticado como vendedor', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${saleToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })

    it('não deve listar sem autenticação', async () => {
      const response = await request(app).get('/users')

      expect(response.status).toBe(401)
    })

    it('não deve listar quando autenticado como cliente', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${customerToken}`)

      expect(response.status).toBe(401)
    })
  })

  describe('PUT /users/:id - Atualizar usuário', () => {
    it('deve atualizar o próprio perfil', async () => {
      const response = await request(app)
        .put(`/users/${customerId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ name: 'Nome Atualizado' })

      expect(response.status).toBe(200)
      expect(response.body.name).toBe('Nome Atualizado')
    })

    it('não deve atualizar sem autenticação', async () => {
      const response = await request(app)
        .put(`/users/${customerId}`)
        .send({ name: 'Teste' })

      expect(response.status).toBe(401)
    })

    it('não deve atualizar perfil de outro usuário (cliente)', async () => {
      const response = await request(app)
        .put(`/users/00000000-0000-0000-0000-000000000000`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ name: 'Teste' })

      expect(response.status).toBe(403)
    })
  })

  describe('DELETE /users/:id - Deletar usuário', () => {
    it('deve deletar usuário quando autenticado como vendedor', async () => {

      const temp = await prisma.users.create({
        data: {
          name: 'Temporário',
          email: 'temp@teste.com',
          password: await hash('senha123', 8)
        }
      })

      const response = await request(app)
        .delete(`/users/${temp.id}`)
        .set('Authorization', `Bearer ${saleToken}`)

      expect(response.status).toBe(204)
    })

    it('não deve deletar sem autenticação', async () => {
      const response = await request(app)
        .delete(`/users/${customerId}`)

      expect(response.status).toBe(401)
    })
  })
})
