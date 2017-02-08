import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token, topic } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
import { schema as topicSchema } from '../topic'
import { schema as versionSchema } from '../version'

export Content, { schema } from './model'

const router = new Router()
const { text } = schema.tree
const { id } = topicSchema.tree
const { name } = versionSchema.tree
/**
 * @api {post} /contents Create content
 * @apiName CreateContent
 * @apiGroup Content
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam text Content's text.
 * @apiSuccess {Object} content Content's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Content not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ text, topicId: id, versionName: name }),
  create)

/**
 * @api {get} /contents Retrieve contents
 * @apiName RetrieveContents
 * @apiGroup Content
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} contents List of contents.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /contents/:id Retrieve content
 * @apiName RetrieveContent
 * @apiGroup Content
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} content Content's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Content not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /contents/:id Update content
 * @apiName UpdateContent
 * @apiGroup Content
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam text Content's text.
 * @apiSuccess {Object} content Content's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Content not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ text }),
  update)

/**
 * @api {delete} /contents/:id Delete content
 * @apiName DeleteContent
 * @apiGroup Content
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Content not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
