'use client'

import { Flex, Text } from '@wowjob/ui'
import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  CategoryScale, // Add this import
} from 'chart.js'

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  CategoryScale
) // Register CategoryScale

type CandleData = { c: number[]; t: number[] }

export const StockChart = ({ symbol }: { symbol: string }) => {
  const [chartData, setChartData] = useState<CandleData>({ c: [], t: [] })

  useEffect(() => {
    const fetchHistoricalData = async () => {
      const to = Math.floor(Date.now() / 1000)
      const from = to - 30 * 24 * 60 * 60 // Last 30 days
      try {
        const response = await fetch(
          `/api/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}`
        )
        const data = await response.json()

        if (data.s === 'ok') {
          setChartData({ c: data.c, t: data.t })
        }
      } catch (error) {
        console.error('Chart error:', error)
      }
    }

    fetchHistoricalData()
  }, [symbol])

  const data = {
    labels: chartData.t.map((timestamp) =>
      new Date(timestamp * 1000).toLocaleDateString()
    ),
    datasets: [
      {
        label: `${symbol} Price`,
        data: chartData.c,
        borderColor: 'blue',
        fill: false,
      },
    ],
  }

  return (
    <Flex mobile={{ padding: 16 }}>
      <Text as="h3">Historical Trends: {symbol}</Text>

      <Line data={data} />
    </Flex>
  )
}
