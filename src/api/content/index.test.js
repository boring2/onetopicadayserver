import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import { Topic } from '../topic'
import routes, { Content } from '.'

const app = () => express(routes)

let userSession, anotherSession, content, topic

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  topic = await Topic.create({ title: 'text title' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  content = await Content.create({ topic, user })
})

test('POST /contents 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, text: 'test', topicId: topic.id})
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.text).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /contents 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /contents 200 (user)', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].user).toEqual('object')
})

test('GET /contents 401', async () => {
  const { status } = await request(app())
    .get('/')
  expect(status).toBe(401)
})

test('GET /contents/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`/${content.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(content.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /contents/:id 401', async () => {
  const { status } = await request(app())
    .get(`/${content.id}`)
  expect(status).toBe(401)
})

test('GET /contents/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /contents/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${content.id}`)
    .send({ access_token: userSession, text: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(content.id)
  expect(body.text).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /contents/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${content.id}`)
    .send({ access_token: anotherSession, text: 'test' })
  expect(status).toBe(401)
})

test('PUT /contents/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${content.id}`)
  expect(status).toBe(401)
})

test('PUT /contents/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession, text: 'test' })
  expect(status).toBe(404)
})

test('DELETE /contents/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${content.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /contents/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${content.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /contents/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${content.id}`)
  expect(status).toBe(401)
})

test('DELETE /contents/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
