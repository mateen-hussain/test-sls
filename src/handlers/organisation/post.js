import log from 'lambda-log'
import { tryFindById, create } from '@/dynamo-db/respositories/organisation'
import ApiResponse from '@/libs/api-response'

export const handler = async (event, context) => {
  log.options.meta.event = event
  log.options.meta.context = context
  const handleResponse = new ApiResponse()

  try {
    const { name, yearFounded, revenue, parentId } = JSON.parse(event.body)

    // if parent organisation doesnt exist in table then throw error
    if (parentId) {
      await tryFindById(parentId)
    }

    const organisation = await create({ name, yearFounded, revenue, parentId })
    log.info('organisation saved', { organisation })
    handleResponse.addData(organisation)
  } catch (err) {
    log.error(err)
    if (err.name && err.name === 'ORGANISATION_NOT_FOUND') {
      err.name = 'PARENT_ORGANISATION_NOT_FOUND'
    }
    handleResponse.addError(err)
  }

  return handleResponse.get()
}
