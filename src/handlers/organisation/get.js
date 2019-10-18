import log from 'lambda-log'
import ApiResponse from '@/libs/api-response'
import { tryFindById } from '@/dynamo-db/respositories/organisation'

export const handler = async (event, context) => {
  log.options.meta.event = event
  log.options.meta.context = context
  const handleResponse = new ApiResponse()
  try {
    const { id } = event.pathParameters
    const organisation = await tryFindById(id)
    log.info('organisation details', { organisation })
    handleResponse.addData(organisation)
  } catch (error) {
    log.error(`get-organisation-details error`, { error })
    handleResponse.addError(error)
  }
  return handleResponse.get()
}
