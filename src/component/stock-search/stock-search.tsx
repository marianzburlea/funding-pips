'use client'

import { Flex, Text, JSONForm } from '@wowjob/ui'
import type { TActionFormReturn } from '@wowjob/ui'
import { Fragment, useState } from 'react'
import { fromStructure } from './form-data'
import { searchStockAction } from './action'
import type { TSearchResult } from '~/type'
import { ErrorMessage } from '../error-message'

export const StockSearch = () => {
  const [resultList, setResults] = useState<TSearchResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async ({ search = '' }: TActionFormReturn['data']) => {
    try {
      setError(null)

      const result = await searchStockAction(String(search))
      setResults(result)

      if (result.length === 0) {
        setError('No results found for this search term.')
      }
    } catch (error: unknown) {
      setError('Failed to fetch search results. Please try again.')

      if (error instanceof Error) {
        console.log(error.message)
      }
    }
  }

  return (
    <Flex mobile={{ padding: 16 }}>
      <JSONForm formStructure={fromStructure} submit={handleSearch} />

      {error && <ErrorMessage message={error} />}

      {resultList.length > 0 && !error && (
        <Flex
          mobile={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
          tablet={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
          desktop={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
        >
          {resultList.map((result) => (
            <Fragment key={result.symbol}>
              <Text mobile={{ fontWeight: 'bold', textAlign: 'right' }}>
                {result.symbol}
              </Text>

              <Text>{result.description}</Text>
            </Fragment>
          ))}
        </Flex>
      )}
    </Flex>
  )
}
