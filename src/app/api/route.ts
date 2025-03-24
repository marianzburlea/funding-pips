// api/route.ts
import { NextResponse } from 'next/server'
import type { TTradeData } from '~/type'

const symbolList = [
  'AAPL', // Apple Inc.
  'MSFT', // Microsoft Corporation
  'GOOGL', // Alphabet Inc.
  'AMZN', // Amazon.com Inc.
  'TSLA', // Tesla Inc.
  'BINANCE:BTCUSDT', // Bitcoin to USDT (Binance)
  'BINANCE:ETHUSDT', // Ethereum to USDT (Binance)
  'IC MARKETS:1', // Forex pair (e.g., EUR/USD on IC Markets)
  'OANDA:USD_JPY', // Forex pair (USD/JPY on OANDA)
  'COINBASE:BTC-USD', // Bitcoin to USD (Coinbase)
]

export const POST = async (request: Request) => {
  const secret = request.headers.get('X-Finnhub-Secret')

  if (secret !== process.env.FINHUB_API_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await request.json()
    console.log('Raw body:', body)

    if (body.type !== 'trade' || !body.data) {
      console.log('Unexpected body format:', body)
    }

    return new NextResponse('Event received', { status: 200 })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new NextResponse('Event received', { status: 200 }) // Still acknowledge to avoid Finnhub disabling the webhook
  }
}

export const GET = async () => {
  const tradeData: TTradeData = {}
  const token = process.env.FINHUB_API_KEY

  if (!token) {
    console.error('Finnhub API key not found')
    return NextResponse.json(tradeData)
  }

  for (const symbol of symbolList) {
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${token}`
      )
      const data = await response.json()

      if (data.c) {
        tradeData[symbol] = {
          symbol,
          price: data.c,
          timestamp: Date.now(),
        }
      }
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error)
    }
  }

  return NextResponse.json(tradeData)
}
