const request = require('supertest')

jest.mock('../server/src/services/leadService', () => ({
  list: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}))

const leadService = require('../server/src/services/leadService')
const app = require('../server/src/app')

const lead = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Jordan Lee',
  email: 'jordan@example.com',
  phone: '+1 555 0100',
  company: 'Northstar Labs',
  source: 'Referral',
  status: 'New',
  createdAt: new Date('2025-01-01T00:00:00Z'),
}

beforeEach(() => jest.clearAllMocks())

describe('Lead API', () => {
  it('lists leads with search and status filters', async () => {
    leadService.list.mockResolvedValue([lead])
    const response = await request(app).get('/api/leads?search=Jordan&status=New')
    expect(response.status).toBe(200)
    expect(response.body.data).toHaveLength(1)
    expect(leadService.list).toHaveBeenCalledWith({ search: 'Jordan', status: 'New' })
  })

  it('creates a lead with valid input', async () => {
    leadService.create.mockResolvedValue(lead)
    const response = await request(app).post('/api/leads').send(lead)
    expect(response.status).toBe(201)
    expect(response.body.data.email).toBe(lead.email)
  })

  it('rejects invalid email and missing fields', async () => {
    const response = await request(app).post('/api/leads').send({ ...lead, email: 'not-an-email', company: '' })
    expect(response.status).toBe(400)
    expect(response.body.errors.map((error) => error.field)).toEqual(expect.arrayContaining(['email', 'company']))
    expect(leadService.create).not.toHaveBeenCalled()
  })

  it('returns 404 when a lead does not exist', async () => {
    leadService.getById.mockResolvedValue(null)
    const response = await request(app).get('/api/leads/507f1f77bcf86cd799439011')
    expect(response.status).toBe(404)
  })

  it('updates a lead', async () => {
    leadService.update.mockResolvedValue({ ...lead, status: 'Qualified' })
    const response = await request(app).put('/api/leads/507f1f77bcf86cd799439011').send({ ...lead, status: 'Qualified' })
    expect(response.status).toBe(200)
    expect(response.body.data.status).toBe('Qualified')
  })

  it('deletes a lead', async () => {
    leadService.remove.mockResolvedValue(lead)
    const response = await request(app).delete('/api/leads/507f1f77bcf86cd799439011')
    expect(response.status).toBe(200)
    expect(leadService.remove).toHaveBeenCalledWith(lead._id)
  })
})
