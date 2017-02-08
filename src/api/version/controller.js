import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Version } from '.'
import { Topic } from '../topic'
import { Content } from '../content'

export const create = ({ user, bodymen: { body } }, res, next) => {
  const topicId = body.topicId
  Topic.findById(topicId)
    .then((topic) => Version.create({ ...body, user, topic }))
    .then((version) => version.view(true))
    .then(success(res, 201))
    .catch(next)
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Version.find(query, select, cursor)
    .populate('user')
    .populate('topic')
    .populate('contents')
    .then((versions) => versions.map((version) => version.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Version.findById(params.id)
    .populate('user')
    .populate('topic')
    .populate('contents')
    .then(notFound(res))
    .then((version) => version ? version.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Version.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((version) => version ? _.merge(version, body).save() : null)
    .then((version) => version ? version.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Version.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((version) => version ? version.remove() : null)
    .then(success(res, 204))
    .catch(next)
