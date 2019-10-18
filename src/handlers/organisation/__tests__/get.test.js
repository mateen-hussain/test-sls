import { handler } from '@/handlers/organisation/get'
import { tryFindById } from '@/dynamo-db/respositories/organisation'

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
  pathParameters: {
    id: mockOrganisationId
  }
}

jest.mock('@/dynamo-db/respositories/organisation', () => ({
  tryFindById: jest.fn()
}))

describe('handler', () => {
  test('should return 200 on success', async () => {
    tryFindById.mockResolvedValueOnce(mockOrganisation)
    const resp = await handler(mockEvent, {})
    const body = JSON.parse(resp.body)
    expect(resp.statusCode).toBe(200)
    expect(body.data).toEqual(mockOrganisation)
    expect(tryFindById).toHaveBeenCalledWith(mockOrganisationId)
  })

  test('should return 500 on failure', async () => {
    const error = new Error('internal error')
    tryFindById.mockRejectedValueOnce(error)
    const resp = await handler(mockEvent, {})
    expect(resp.statusCode).toBe(500)
  })
})
