import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";

export default function GuestbookPage() {
  return (
    <Box w="full">
      <Container>
        <Heading as="h1">Guestbook</Heading>
        <Text>Write a message for me and others.</Text>
        <Button>Sign In with Github</Button>
        <Button variant="outline">Sign In with Google</Button>
      </Container>
    </Box>
  );
}
