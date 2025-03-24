'use server'

export const searchStockAction = async (stockName: string) => {
  if (!stockName || stockName.length < 2) {
    return []
  }

  try {
    // const response = await fetch(
    //   `https://finnhub.io/api/v1/search?q=${stockName}&token=${process.env.FINHUB_API_KEY}`
    // )
    const response = await fetch(
      `http://localhost:3000/api/search/${stockName}`
    )
    const data = await response.json()
    return data.result || []
  } catch (error) {
    console.error('Server action search error:', error)
    return []
  }
}
