import { Flex, HStack, Spinner, Text } from "@chakra-ui/react";

export default function LoadingReactQuery() {
  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <HStack>
        <Text fontWeight="bold" fontSize="xl">
          Loading
        </Text>
        <Spinner />
      </HStack>
    </Flex>
  );
}
