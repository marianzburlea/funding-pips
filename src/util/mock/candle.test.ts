import { generateMockCandleData } from './candle'
import type { TCandleResponse } from '~/type'

describe('generateMockCandleData', () => {
  const from = 1700000000
  const to = 1702592000
  const expectedDays = Math.floor((to - from) / (24 * 60 * 60))

  it('should generate data for supported symbol AAPL with base price 150', () => {
    const data: TCandleResponse = generateMockCandleData('AAPL', from, to)
    expect(data.s).toBe('ok')
    expect(data.c.length).toBe(expectedDays)
    expect(data.t.length).toBe(expectedDays)
    expect(data.o.length).toBe(expectedDays)
    expect(data.h.length).toBe(expectedDays)
    expect(data.l.length).toBe(expectedDays)
    expect(data.v.length).toBe(expectedDays)
    expect(data.o[0]).toBeCloseTo(150, -1) // Allow ±2.5 variation
  })

  it('should generate data for supported symbol MSFT with base price 400', () => {
    const data: TCandleResponse = generateMockCandleData('MSFT', from, to)
    expect(data.s).toBe('ok')
    expect(data.c.length).toBe(expectedDays)
    expect(data.o[0]).toBeCloseTo(400, -1) // Allow ±2.5 variation
  })

  it('should generate data for supported symbol TSLA with base price 100', () => {
    const data: TCandleResponse = generateMockCandleData('TSLA', from, to)
    expect(data.s).toBe('ok')
    expect(data.c.length).toBe(expectedDays)
    expect(data.o[0]).toBeCloseTo(100, -1) // Allow ±2.5 variation
  })

  it('should return no_data for unsupported symbol XYZ', () => {
    const data: TCandleResponse = generateMockCandleData('XYZ', from, to)
    expect(data.s).toBe('no_data')
    expect(data.c).toEqual([])
    expect(data.h).toEqual([])
    expect(data.l).toEqual([])
    expect(data.o).toEqual([])
    expect(data.t).toEqual([])
    expect(data.v).toEqual([])
  })

  it('should generate correct number of days based on from/to range', () => {
    const shortFrom = 1700000000
    const shortTo = 1700086400
    const expectedShortDays = 1
    const data: TCandleResponse = generateMockCandleData(
      'AAPL',
      shortFrom,
      shortTo
    )
    expect(data.s).toBe('ok')
    expect(data.c.length).toBe(expectedShortDays)
    expect(data.t[0]).toBe(shortFrom)
  })

  it('should handle zero-day range gracefully', () => {
    const data: TCandleResponse = generateMockCandleData('AAPL', from, from)
    expect(data.s).toBe('ok')
    expect(data.c.length).toBe(0)
    expect(data.t.length).toBe(0)
  })
})
