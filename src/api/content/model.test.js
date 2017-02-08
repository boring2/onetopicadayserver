import { Content } from '.'
import { User } from '../user'
import { Topic } from '../topic'

let user, content, topic

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  topic = await Topic.create({ title: 'text title' })
  content = await Content.create({ user, topic, text: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = content.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(content.id)
    expect(typeof view.user).toBe('object')
    expect(typeof view.topic).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.topic.id).toBe(topic.id)
    expect(view.text).toBe(content.text)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = content.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(content.id)
    expect(typeof view.user).toBe('object')
    expect(typeof view.topic).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.topic.id).toBe(topic.id)
    expect(view.text).toBe(content.text)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
