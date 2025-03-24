// api/route.test.ts
import type { TTradeData } from '~/type'
import { GET, POST } from './route'

// Mock NextResponse
jest.mock('next/server', () => {
  const NextResponseMock = {
    constructor: jest.fn((body: string, init?: { status?: number }) => ({
      status: init?.status || 200,
      text: () => Promise.resolve(body),
      json: () => Promise.resolve(body),
    })),
    json: jest.fn((data: TTradeData) => ({
      json: () => Promise.resolve(data),
    })),
  }
  const mockNextResponse = Object.assign(
    jest.fn((body: string, init?: { status?: number }) =>
      NextResponseMock.constructor(body, init)
    ),
    { json: NextResponseMock.json }
  )
  return {
    NextResponse: mockNextResponse,
  }
})

// Mock fetch
global.fetch = jest.fn()

describe('API /api/route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.FINHUB_API_KEY = 'test-key'
    process.env.FINHUB_API_SECRET = 'test-secret'
    ;(global.fetch as jest.Mock).mockReset() // Ensure fetch is reset
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // POST Tests (unchanged)
  describe('POST', () => {
    it('returns 401 for invalid secret', async () => {
      const request = new Request('http://localhost:3000/api', {
        method: 'POST',
        headers: { 'X-Finnhub-Secret': 'wrong-secret' },
      })
      const response = await POST(request)
      expect(response.status).toBe(401)
      expect(await response.text()).toBe('Unauthorized')
    })

    it('returns 200 for valid secret and trade body', async () => {
      const request = new Request('http://localhost:3000/api', {
        method: 'POST',
        headers: { 'X-Finnhub-Secret': 'test-secret' },
        body: JSON.stringify({
          type: 'trade',
          data: { symbol: 'AAPL', price: 150 },
        }),
      })
      const response = await POST(request)
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('Event received')
    })

    it('returns 200 for valid secret with invalid body', async () => {
      const request = new Request('http://localhost:3000/api', {
        method: 'POST',
        headers: { 'X-Finnhub-Secret': 'test-secret' },
        body: JSON.stringify({ type: 'not-trade', data: null }),
      })
      const response = await POST(request)
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('Event received')
    })

    it('handles malformed JSON body gracefully', async () => {
      const request = new Request('http://localhost:3000/api', {
        method: 'POST',
        headers: { 'X-Finnhub-Secret': 'test-secret' },
        body: 'invalid-json',
      })
      const response = await POST(request)
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('Event received')
    })
  })

  // GET Tests
  describe('GET', () => {
    it('handles fetch errors for some symbols gracefully', async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 150 }) })
        .mockRejectedValueOnce(new Error('MSFT fetch error'))
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 1000 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 2000 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 300 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 50000 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 3000 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 1.2 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 110 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 49000 }) })

      const response = await GET()
      const data = await response.json()

      expect(Object.keys(data).length).toBe(9)
      expect(data.AAPL.price).toBe(150)
      expect(data.MSFT).toBeUndefined()
      expect(global.fetch).toHaveBeenCalledTimes(10)
    })
  })

  describe('GET', () => {
    it('handles fetch errors for some symbols gracefully', async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 150 }) })
        .mockRejectedValueOnce(new Error('MSFT fetch error'))
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 1000 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 2000 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 300 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 50000 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 3000 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 1.2 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 110 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ c: 49000 }) })

      const response = await GET()
      const data = await response.json()

      expect(Object.keys(data).length).toBe(9)
      expect(data.AAPL.price).toBe(150)
      expect(data.MSFT).toBeUndefined()
      expect(global.fetch).toHaveBeenCalledTimes(10)
    })
  })
})

// Mock console methods to suppress logs (moved outside describe for consistency)
jest.spyOn(console, 'log').mockImplementation(() => {})
jest.spyOn(console, 'error').mockImplementation(() => {})
