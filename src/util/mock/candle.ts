// util/mock/candle.ts
import type { TCandleResponse } from '~/type'

// Supported symbols (aligned with your app’s stock list or mock logic)
const SUPPORTED_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']

export const generateMockCandleData = (
  symbol: string,
  from: number,
  to: number
) => {
  // Check if symbol is supported
  if (!SUPPORTED_SYMBOLS.includes(symbol)) {
    return {
      c: [],
      h: [],
      l: [],
      o: [],
      s: 'no_data' as const,
      t: [],
      v: [],
    }
  }

  const data: TCandleResponse = {
    c: [],
    h: [],
    l: [],
    o: [],
    s: 'ok',
    t: [],
    v: [],
  }

  const days = Math.floor((to - from) / (24 * 60 * 60))
  let currentPrice = symbol === 'AAPL' ? 150 : symbol === 'MSFT' ? 400 : 100
  const daySeconds = 24 * 60 * 60

  for (let i = 0; i < days; i++) {
    const timestamp = from + i * daySeconds
    const open = currentPrice + (Math.random() - 0.5) * 5
    const high = open + Math.random() * 10
    const low = open - Math.random() * 10
    const close = low + Math.random() * (high - low)
    const volume = Math.floor(Math.random() * 1000000)

    data.t.push(timestamp)
    data.o.push(Number(open.toFixed(2)))
    data.h.push(Number(high.toFixed(2)))
    data.l.push(Number(low.toFixed(2)))
    data.c.push(Number(close.toFixed(2)))
    data.v.push(volume)

    currentPrice = close
  }

  return data
}
