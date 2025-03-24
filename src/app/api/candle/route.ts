// api/candel/route.ts
import { NextResponse } from 'next/server'
import { generateMockCandleData } from '~/util'

// Mock data generator for a given symbol

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')
  const resolution = searchParams.get('resolution')
  const from = Number.parseInt(searchParams.get('from') || '0')
  const to = Number.parseInt(searchParams.get('to') || '0')

  // Basic validation
  if (!symbol || !resolution || !from || !to || to <= from) {
    return NextResponse.json({
      s: 'no_data',
      c: [],
      h: [],
      l: [],
      o: [],
      t: [],
      v: [],
    })
  }

  // Supported resolutions: 1, 5, 15, 30, 60, D, W, M
  if (!['1', '5', '15', '30', '60', 'D', 'W', 'M'].includes(resolution)) {
    return NextResponse.json({
      s: 'no_data',
      c: [],
      h: [],
      l: [],
      o: [],
      t: [],
      v: [],
    })
  }

  // Generate mock data for the requested symbol
  const mockData = generateMockCandleData(symbol, from, to)
  return NextResponse.json(mockData)
}
