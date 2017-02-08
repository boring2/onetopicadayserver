import request from 'supertest-as-promised'
import { masterKey } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Article } from '.'

const app = () => express(routes)

let userSession, anotherSession, adminSession, article

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  adminSession = signSync(admin.id)
  article = await Article.create({ user })
})

test('POST /articles 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, title: 'test', content: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
  expect(body.content).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /articles 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /articles 200 (user)', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].user).toEqual('object')
})

test('GET /articles 401', async () => {
  const { status } = await request(app())
    .get('/')
  expect(status).toBe(401)
})

test('GET /articles/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`/${article.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(article.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /articles/:id 401', async () => {
  const { status } = await request(app())
    .get(`/${article.id}`)
  expect(status).toBe(401)
})

test('GET /articles/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /articles/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${article.id}`)
    .send({ access_token: userSession, title: 'test', content: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(article.id)
  expect(body.title).toEqual('test')
  expect(body.content).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /articles/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${article.id}`)
    .send({ access_token: anotherSession, title: 'test', content: 'test' })
  expect(status).toBe(401)
})

test('PUT /articles/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${article.id}`)
  expect(status).toBe(401)
})

test('PUT /articles/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession, title: 'test', content: 'test' })
  expect(status).toBe(404)
})

test('DELETE /articles/:id 204 (master)', async () => {
  const { status } = await request(app())
    .delete(`/${article.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(204)
})

test('DELETE /articles/:id 401 (admin)', async () => {
  const { status } = await request(app())
    .delete(`/${article.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(401)
})

test('DELETE /articles/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${article.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /articles/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${article.id}`)
  expect(status).toBe(401)
})

test('DELETE /articles/:id 404 (master)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})
