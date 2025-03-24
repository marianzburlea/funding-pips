// page.tsx
import { Text } from '@wowjob/ui'
import { LastPrice, StockSearch } from '~/component'

const HomePage = () => {
  return (
    <>
      <Text as="h1">Funding Pips</Text>

      <StockSearch />

      <LastPrice />
    </>
  )
}

export default HomePage
