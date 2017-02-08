import { Topic } from '.'

let topic

beforeEach(async () => {
  topic = await Topic.create({ title: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = topic.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(topic.id)
    expect(view.title).toBe(topic.title)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = topic.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(topic.id)
    expect(view.title).toBe(topic.title)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
