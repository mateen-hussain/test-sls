import {
  create,
  findById,
  tryFindById
} from '../organisation'
import Organisation from '@/dynamo-db/models/organisation'

jest.mock('uuid', () => ({
  v4: () => ('randomdId')
}))

const mockQueryOneFn = jest.fn()
const mockEqFn = jest.fn()
const mockExecFn = jest.fn()
const mockWhereFn = jest.fn()
const mockUsingFn = jest.fn()

jest.mock('@/dynamo-db/models/organisation', () => ({
  create: jest.fn(),
  update: jest.fn(),
  queryOne: jest.fn((key) => {
    mockQueryOneFn(key)
    return {
      eq: jest.fn((val) => {
        mockEqFn(val)
        return {
          exec: jest.fn(() => mockExecFn()),
          where: jest.fn((key) => {
            mockWhereFn(key)
            return {
              eq: jest.fn((val) => {
                mockEqFn(val)
                return {
                  using: jest.fn((index) => {
                    mockUsingFn(index)
                    return {
                      exec: jest.fn(() => mockExecFn())
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}))

describe('create', () => {
  const name = 'test'
  const yearFounded = '123'
  const revenue = '203.00'
  const parentId = 'p123'
  const expctedCreateOrganisationArgs = {
    id: 'randomdId',
    name,
    yearFounded,
    revenue,
    parentId
  }
  test('should call create organisation', async () => {
    Organisation.create.mockResolvedValueOnce(true)
    const resp = await create({ name, yearFounded, revenue, parentId })
    expect(Organisation.create).toBeCalledWith(expctedCreateOrganisationArgs)
    expect(resp).toBe(true)
  })
})

describe('findById', () => {
  test('should return a single item', async () => {
    await findById('123')
    expect(mockQueryOneFn).toBeCalledWith('id')
    expect(mockEqFn).toBeCalledWith('123')
    expect(mockExecFn).toBeCalled()
  })
})

describe('tryFindById', () => {
  test('should return a single item if found', async () => {
    const expectedOrganisation = { id: 'c123' }
    mockExecFn.mockResolvedValueOnce(expectedOrganisation)
    const organisation = await tryFindById('c123')
    expect(organisation).toBe(expectedOrganisation)
  })
  test('should throw ORGANISATION_NOT_FOUND error if item not found', () => {
    const error = new Error('organisation not found')
    error.code = 404
    error.name = 'ORGANISATION_NOT_FOUND'
    mockExecFn.mockResolvedValueOnce(null)
    expect(tryFindById('c124')).rejects.toEqual(error)
  })
})
