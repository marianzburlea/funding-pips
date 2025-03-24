// api/search/[term]/search.test.ts
import { GET } from './route'
import { unstable_cache } from 'next/cache'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => ({ json: () => data })),
  },
}))

// Mock unstable_cache
jest.mock('next/cache', () => ({
  unstable_cache: jest.fn((fn) => fn),
}))

// Mock fetch
global.fetch = jest.fn()

describe('GET /api/search/[term]', () => {
  const mockRequest = (term: string) =>
    new Request(`http://localhost:3000/api/search/${term}`)

  const mockParams = (term: string) => ({
    params: Promise.resolve({ term }),
  })

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock console.error to suppress logs during tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore console.error after each test
    jest.restoreAllMocks()
  })

  it('should return search results for valid term (AAPL)', async () => {
    const mockResults = [
      {
        symbol: 'AAPL',
        description: 'Apple Inc.',
        type: 'stock',
        displaySymbol: 'AAPL',
      },
    ]
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ result: mockResults }),
    })

    const request = mockRequest('AAPL')
    const response = await GET(request, mockParams('AAPL'))
    const data = await response.json()

    expect(data).toEqual({ result: mockResults })
    expect(global.fetch).toHaveBeenCalledWith(
      `https://finnhub.io/api/v1/search?q=AAPL&token=${process.env.FINHUB_API_KEY}`
    )
    expect(unstable_cache).toHaveBeenCalledWith(
      expect.any(Function),
      ['search-AAPL'],
      { revalidate: 300 }
    )
  })

  it('should return empty array for term shorter than 2 characters', async () => {
    const request = mockRequest('A')
    const response = await GET(request, mockParams('A'))
    const data = await response.json()

    expect(data).toEqual({ result: [] })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should return empty array for empty term', async () => {
    const request = mockRequest('')
    const response = await GET(request, mockParams(''))
    const data = await response.json()

    expect(data).toEqual({ result: [] })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('handles fetch error gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    )

    const request = mockRequest('GOOGL')
    const response = await GET(request, mockParams('GOOGL'))
    const data = await response.json()

    expect(data).toEqual({ result: [] })
    expect(global.fetch).toHaveBeenCalledWith(
      `https://finnhub.io/api/v1/search?q=GOOGL&token=${process.env.FINHUB_API_KEY}`
    )
  })

  it('should return empty array when Finnhub should return no results', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ result: null }),
    })

    const request = mockRequest('XYZ')
    const response = await GET(request, mockParams('XYZ'))
    const data = await response.json()

    expect(data).toEqual({ result: [] })
  })
})
