import { Flex, Text } from '@wowjob/ui'

export const ErrorMessage = ({ message }: { message: string }) => (
  <Flex
    theme="error"
    mobile={{ padding: [16, 32], borderRadius: 16, width: 'fit-content' }}
  >
    <Text>{message}</Text>
  </Flex>
)
