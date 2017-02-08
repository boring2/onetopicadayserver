import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Content } from '.'
import { Topic } from '../topic'
import { Version } from '../version'

export const create = ({ user, bodymen: { body } }, res, next) => {
  const topicId = body.topicId
  const versionName = body.versionName

  Topic.findById(topicId)
    .then((topic) => Content.create({ ...body, user, topic }))
    .then((content) => {
      Version.update({name: versionName}, {$addToSet: {contents: content}, topic: content.topic, user: content.user}, {safe: true, upsert: true})
        .then(() => content.view(true))
        .then(success(res, 201))
        .catch(next)
    })
    .catch(next)

}

export const index = ({ querymen: { query, select, cursor } }, res, next) => {
  Content.find(query, select, cursor)
    .populate('user')
    .then((contents) => contents.map((content) => content.view()))
    .then(success(res))
    .catch(next)
}

export const show = ({ params }, res, next) =>
  Content.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((content) => content ? content.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Content.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((content) => content ? _.merge(content, body).save() : null)
    .then((content) => content ? content.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Content.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((content) => content ? content.remove() : null)
    .then(success(res, 204))
    .catch(next)
