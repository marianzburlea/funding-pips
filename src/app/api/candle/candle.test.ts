import { GET } from './route'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => ({ json: () => data })),
  },
}))

describe('GET /api/candle', () => {
  const mockRequest = (
    symbol: string,
    resolution: string,
    from: string,
    to: string
  ) =>
    new Request(
      `http://localhost:3000/api/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`
    )

  it('should return mock data for supported symbol (AAPL)', async () => {
    const request = mockRequest('AAPL', 'D', '1700000000', '1702592000')
    const response = await GET(request)
    const data = await response.json()

    expect(data.s).toBe('ok')
    expect(data.c.length).toBeGreaterThan(0)
    expect(data.t.length).toBeGreaterThan(0)
  })

  it('should return no_data for unsupported symbol (XYZ)', async () => {
    const request = mockRequest('XYZ', 'D', '1700000000', '1702592000')
    const response = await GET(request)
    const data = await response.json()

    expect(data.s).toBe('no_data')
    expect(data.c).toEqual([])
    expect(data.t).toEqual([])
  })

  it('should return no_data for invalid resolution', async () => {
    const request = mockRequest('AAPL', 'INVALID', '1700000000', '1702592000')
    const response = await GET(request)
    const data = await response.json()

    expect(data.s).toBe('no_data')
    expect(data.c).toEqual([])
  })
})
