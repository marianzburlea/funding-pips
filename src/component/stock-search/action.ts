'use server'

const apiUrl = process.env.API_URL || 'http://localhost:3000'

export const searchStockAction = async (stockName: string) => {
  if (!stockName || stockName.length < 2) {
    return []
  }

  try {
    const response = await fetch(`${apiUrl}/api/search/${stockName}`)
    const data = await response.json()

    return data.result || []
  } catch (error) {
    console.error('Server action search error:', error)
    return []
  }
}
