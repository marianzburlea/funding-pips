import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TTradeData } from './type'

type TStockStore = {
  stockList: Record<string, TTradeData[string]>
  watchlist: string[]
  addToWatchlist: (symbol: string) => void
  removeFromWatchlist: (symbol: string) => void
  startPolling: () => void
  stopPolling: () => void
  error: string | null
}

export const useStockStore = create<TStockStore>()(
  persist(
    (set) => {
      let interval: NodeJS.Timeout | null = null

      return {
        stockList: {},
        watchlist: [],
        error: null, // Initial error state

        addToWatchlist: (symbol: string) =>
          set((state) => ({
            watchlist: [...new Set([...state.watchlist, symbol])],
          })),

        removeFromWatchlist: (symbol: string) =>
          set((state) => ({
            watchlist: state.watchlist.filter((s) => s !== symbol),
          })),

        startPolling: () => {
          const fetchTrades = async () => {
            try {
              const response = await fetch('/api')
              const data = await response.json()
              set({ stockList: data, error: null })
            } catch (error: unknown) {
              set({ error: 'Failed to fetch stock prices.' })

              if (error instanceof Error) {
                console.log('startPolling error', error.message)
              }
            }
          }

          fetchTrades()
          interval = setInterval(fetchTrades, 5000)
        },

        stopPolling: () => {
          if (interval) {
            clearInterval(interval)
            interval = null
          }
          set({ stockList: {}, error: null }) // Reset error on stop
        },
      }
    },
    { name: 'stock-store' }
  )
)
