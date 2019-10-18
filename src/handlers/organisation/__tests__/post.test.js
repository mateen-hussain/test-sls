import { handler } from '@/handlers/organisation/post'
import { tryFindById, create } from '@/dynamo-db/respositories/organisation'

const mockOrganisationId = 'c123'
const mockYearFounded = 123
const mockName = 'd123'
const mockRevenue = 201001.00
const mockParentId = 'r123'
const mockOrganisation = {
  id: mockOrganisationId,
  name: mockName,
  yearFounded: mockYearFounded,
  revenue: mockRevenue,
  parentId: mockParentId
}
const mockEvent = {
  body: JSON.stringify({ name: mockName, yearFounded: mockYearFounded, revenue: mockRevenue, parentId: mockParentId })
}

jest.mock('@/dynamo-db/respositories/organisation', () => ({
  tryFindById: jest.fn(),
  create: jest.fn()
}))

describe('handler', () => {
  test('should return 200 on success', async () => {
    tryFindById.mockResolvedValueOnce()
    create.mockResolvedValueOnce(mockOrganisation)
    const resp = await handler(mockEvent, {})
    const body = JSON.parse(resp.body)
    expect(resp.statusCode).toBe(200)
    expect(body.data).toEqual(mockOrganisation)
    expect(tryFindById).toHaveBeenCalledWith(mockParentId)
  })

  test('should return ORGANISATION_NOT_FOUND on parentId not found in table', async () => {
    var mockerror = new Error('organisation not found')
    mockerror.code = 404
    mockerror.name = 'ORGANISATION_NOT_FOUND'
    tryFindById.mockRejectedValueOnce(mockerror)
    const resp = await handler(mockEvent, {})
    const body = JSON.parse(resp.body)
    expect(resp.statusCode).toBe(404)
    expect(body.status.message).toBe('PARENT_ORGANISATION_NOT_FOUND')
  })

  test('should return 500 on failure', async () => {
    const error = new Error('internal error')
    tryFindById.mockRejectedValueOnce(error)
    const resp = await handler(mockEvent, {})
    expect(resp.statusCode).toBe(500)
  })
})
