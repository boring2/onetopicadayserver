import { Version } from '.'
import { User } from '../user'

let user, version

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  version = await Version.create({ user, name: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = version.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(version.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.name).toBe(version.name)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = version.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(version.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.name).toBe(version.name)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
