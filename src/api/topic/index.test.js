import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Topic } from '.'

const app = () => express(routes)

let userSession, adminSession, topic

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  topic = await Topic.create({})
})

test('POST /topics 201 (admin)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: adminSession, title: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
})

test('POST /topics 401 (user)', async () => {
  const { status } = await request(app())
    .post('/')
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /topics 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /topics 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /topics/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`/${topic.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(topic.id)
})

test('GET /topics/:id 404', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /topics/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .put(`/${topic.id}`)
    .send({ access_token: adminSession, title: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(topic.id)
  expect(body.title).toEqual('test')
})

test('PUT /topics/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`/${topic.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /topics/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${topic.id}`)
  expect(status).toBe(401)
})

test('PUT /topics/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: adminSession, title: 'test' })
  expect(status).toBe(404)
})

test('DELETE /topics/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`/${topic.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /topics/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${topic.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /topics/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${topic.id}`)
  expect(status).toBe(401)
})

test('DELETE /topics/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
