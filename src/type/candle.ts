// type/candle.ts

export type TCandleResponse = {
  c: number[] // Close prices
  h: number[] // High prices
  l: number[] // Low prices
  o: number[] // Open prices
  s: 'ok' | 'no_data' // Status
  t: number[] // Timestamps
  v: number[] // Volume
}
