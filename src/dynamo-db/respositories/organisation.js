import uuid from 'uuid'
import Organisation from '@/dynamo-db/models/organisation'

const organisationNotFoundError = () => {
  var error = new Error('organisation not found')
  error.code = 404
  error.name = 'ORGANISATION_NOT_FOUND'
  return error
}

/**
 * Get the record with the specified organisationId.
 * @param id
 */
export const findById = async (id) => {
  return Organisation
    .queryOne('id')
    .eq(id)
    .exec()
}

/**
 * Get a organisation with id. If not found then throws an error
 * @param {String} id
 */
export const tryFindById = async (id) => {
  const organisation = await findById(id)
  if (!organisation) {
    throw organisationNotFoundError()
  }
  return organisation
}

/**
 * Creates a organisation
 * @param {String} name
 * @param {String} yearFounded
 * @param {String} revenue
 * @param {String} parentId
 */
export const create = async ({ name, yearFounded, revenue, parentId }) => {
  const id = uuid.v4()
  return Organisation.create({
    id,
    name,
    yearFounded,
    revenue,
    parentId
  })
}
