import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
import { schema as topicSchema } from '../topic'
import { schema as contentSchema } from '../content'
export Version, { schema } from './model'

const router = new Router()
const { name, contents } = schema.tree
const { id:topicId } = topicSchema.tree
const { id:contentId } = contentSchema.tree
/**
 * @api {post} /versions Create version
 * @apiName CreateVersion
 * @apiGroup Version
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Version's name.
 * @apiSuccess {Object} version Version's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Version not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ name, topicId, contents }),
  create)

/**
 * @api {get} /versions Retrieve versions
 * @apiName RetrieveVersions
 * @apiGroup Version
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} versions List of versions.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /versions/:id Retrieve version
 * @apiName RetrieveVersion
 * @apiGroup Version
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} version Version's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Version not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /versions/:id Update version
 * @apiName UpdateVersion
 * @apiGroup Version
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Version's name.
 * @apiSuccess {Object} version Version's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Version not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ name }),
  update)

/**
 * @api {delete} /versions/:id Delete version
 * @apiName DeleteVersion
 * @apiGroup Version
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Version not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
