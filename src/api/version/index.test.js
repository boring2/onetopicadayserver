import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Version } from '.'

const app = () => express(routes)

let userSession, anotherSession, version

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  version = await Version.create({ user })
})

test('POST /versions 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, name: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.name).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /versions 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /versions 200 (user)', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].user).toEqual('object')
})

test('GET /versions 401', async () => {
  const { status } = await request(app())
    .get('/')
  expect(status).toBe(401)
})

test('GET /versions/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`/${version.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(version.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /versions/:id 401', async () => {
  const { status } = await request(app())
    .get(`/${version.id}`)
  expect(status).toBe(401)
})

test('GET /versions/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /versions/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${version.id}`)
    .send({ access_token: userSession, name: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(version.id)
  expect(body.name).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /versions/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${version.id}`)
    .send({ access_token: anotherSession, name: 'test' })
  expect(status).toBe(401)
})

test('PUT /versions/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${version.id}`)
  expect(status).toBe(401)
})

test('PUT /versions/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession, name: 'test' })
  expect(status).toBe(404)
})

test('DELETE /versions/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${version.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /versions/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${version.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /versions/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${version.id}`)
  expect(status).toBe(401)
})

test('DELETE /versions/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
