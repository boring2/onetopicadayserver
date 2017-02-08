import _ from 'lodash'
import { success, notFound } from '../../services/response/'
import { Topic } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Topic.create(body)
    .then((topic) => topic.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Topic.find(query, select, cursor)
    .then((topics) => topics.map((topic) => topic.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Topic.findById(params.id)
    .then(notFound(res))
    .then((topic) => topic ? topic.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Topic.findById(params.id)
    .then(notFound(res))
    .then((topic) => topic ? _.merge(topic, body).save() : null)
    .then((topic) => topic ? topic.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Topic.findById(params.id)
    .then(notFound(res))
    .then((topic) => topic ? topic.remove() : null)
    .then(success(res, 204))
    .catch(next)
