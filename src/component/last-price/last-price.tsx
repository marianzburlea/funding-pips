'use client'

import { Button, Flex, Text } from '@wowjob/ui'
import { useEffect } from 'react'
import { useStockStore } from '~/store'
import { StockChart } from '../stock-chart'
import { ErrorMessage } from '../error-message'

export const LastPrice = () => {
  const {
    stockList,
    watchlist,
    error,
    addToWatchlist,
    removeFromWatchlist,
    startPolling,
    stopPolling,
  } = useStockStore()

  useEffect(() => {
    startPolling()
    return () => stopPolling()
  }, [startPolling, stopPolling])

  return (
    <Flex mobile={{ padding: 16 }}>
      <Text as="h2">Last Price</Text>

      {error && <ErrorMessage message={error} />}

      {!error &&
        Object.values(stockList).map((stock) => (
          <Flex
            key={stock.symbol}
            mobile={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Text>
              {stock.symbol}: ${stock.price} (Updated:{' '}
              {new Date(stock.timestamp).toLocaleTimeString()})
            </Text>

            {watchlist.includes(stock.symbol) ? (
              <Button
                theme="secondary"
                onClick={() => removeFromWatchlist(stock.symbol)}
              >
                Remove
              </Button>
            ) : (
              <Button
                theme="secondary"
                onClick={() => addToWatchlist(stock.symbol)}
              >
                Add to Watchlist
              </Button>
            )}
          </Flex>
        ))}

      <Text as="h2">Watchlist</Text>

      {watchlist.map((symbol) => (
        <StockChart key={symbol} symbol={symbol} />
      ))}
    </Flex>
  )
}
