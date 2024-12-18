import { dateFormatter } from "@/lib/helpers/date-formatter";
import { trpc } from "@/lib/utils/trpc";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { FaGithub } from "react-icons/fa";

interface GuestbookProps {
  id: number;
  created_at: string;
  email: string;
  username: string;
  message: string;
}

export default function Guestbook() {
  const queryClient = useQueryClient();

  const [message, setMessage] = useState<string>("");

  const { refetch, data, isPending, isError } = trpc.guestbook.get.useQuery(
    { key: "get-guestbook" },
    {
      placeholderData: keepPreviousData,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const { data: session } = useSession();

  const createNewMessageMutation = trpc.guestbook.post.useMutation({
    mutationKey: ["create-new-message"],
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: ["create-new-message"],
        exact: true,
      }),
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    createNewMessageMutation
      .mutateAsync({
        email: session?.user.email as string,
        username: session?.user.name as string,
        message,
      })
      .then(() => {
        refetch();
        setMessage("");
      });
  }

  if (isPending)
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
  if (isError)
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Text fontWeight="bold" fontSize="2xl">
          Error!
        </Text>
      </Flex>
    );

  const guestbook: Omit<GuestbookProps, "email">[] = data;

  return (
    <Box w="full" py={4}>
      <Container spaceY={5} maxW="3xl">
        <Box spaceY={4}>
          <Box spaceY={2}>
            <Heading as="h1" fontSize="3xl" fontWeight="extrabold">
              Guestbook
            </Heading>
            <Text>
              Write a message for me and others.{" "}
              {session ? (
                <span
                  style={{
                    fontWeight: "bold",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => signOut()}
                >
                  Sign Out
                </span>
              ) : null}
            </Text>
          </Box>
          {!session ? (
            <Button fontWeight="bold" onClick={() => signIn("github")}>
              <FaGithub /> Sign In with Github
            </Button>
          ) : (
            <form onSubmit={handleSubmit}>
              <Textarea
                placeholder="Your Message...."
                borderColor="gray.500"
                h="80px"
                value={message}
                _placeholder={{ color: "gray.500" }}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <Button
                mt={1}
                size="sm"
                type="submit"
                fontWeight="bold"
                bg="#ECF2F8"
                color="black"
              >
                Submit
              </Button>
            </form>
          )}
        </Box>
        <Box spaceY={4}>
          {guestbook
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((item) => (
              <Box
                spaceY={1}
                key={item.id}
                p={2}
                border="1px solid"
                borderColor="gray.500"
                borderRadius="sm"
              >
                <Flex
                  direction={{ base: "column-reverse", sm: "row" }}
                  w="full"
                  justifyContent="space-between"
                >
                  <Text fontSize="lg" fontWeight="bold">
                    {item.message}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {dateFormatter.format(new Date(item.created_at))}
                  </Text>
                </Flex>
                <Text fontSize="sm">@{item.username}</Text>
              </Box>
            ))}
        </Box>
      </Container>
    </Box>
  );
}
