// api/search/[term]/route.ts
import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import type { TSearchResult } from '~/type'

const fetchSearchResultList = async (
  term: string
): Promise<TSearchResult[]> => {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/search?q=${term}&token=${process.env.FINHUB_API_KEY}`
    )
    const result = ((await response.json()).result as TSearchResult[]) || []

    return result
  } catch (error) {
    console.error('Search API error:', error)
    return []
  }
}

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ term: string }> }
) => {
  const { term } = await params

  if (!term || term.length < 2) {
    return NextResponse.json({ result: [] })
  }

  // Cache the fetch function with a 5-minute revalidation period, using the term as the cache key
  const cachedFetch = unstable_cache(
    () => fetchSearchResultList(term),
    [`search-${term}`], // Unique cache key based on the search term
    { revalidate: 300 } // Cache for 5 minutes (300 seconds)
  )

  const result = await cachedFetch()

  return NextResponse.json({ result })
}
