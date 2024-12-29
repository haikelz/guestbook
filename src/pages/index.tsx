import ErrorReactQuery from "@/components/error-react-query";
import LoadingReactQuery from "@/components/loading-react-query";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { dateFormatter } from "@/lib/helpers/date-formatter";
import { NEXT_PUBLIC_ADMIN_EMAIL } from "@/lib/utils/constants";
import { isCreateNewMessageAtom } from "@/lib/utils/recoil";
import { messageSchema } from "@/lib/utils/schemas";
import { trpc } from "@/lib/utils/trpc";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useForm } from "react-hook-form";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useRecoilState } from "recoil";

interface GuestbookProps {
  id: number;
  created_at: string;
  email: string;
  username: string;
  message: string;
}

export default function Guestbook() {
  const queryClient = useQueryClient();

  const [isCreateNewMessage, setIsCreateNewMessage] = useRecoilState(
    isCreateNewMessageAtom
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: { message: "" },
    resolver: zodResolver(messageSchema),
  });

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
    onError: () => {
      toaster.create({
        type: "error",
        title: "Gagal membuat pesan baru!",
      });
    },
  });

  // only for admin
  const deleteMessageMutation = trpc.guestbook.delete.useMutation({
    mutationKey: ["delete-message"],
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: ["delete-message"],
        exact: true,
      }),
    onError: () => {
      toaster.create({
        type: "error",
        title: "Gagal menghapus pesan ini!",
      });
    },
  });

  async function onSubmit() {
    await createNewMessageMutation
      .mutateAsync({
        email: session?.user.email as string,
        username: session?.user.name as string,
        message: getValues("message"),
      })
      .then(() => {
        refetch();
        setValue("message", "");
        setIsCreateNewMessage(false);
      });
  }

  async function handleDeleteMessage(id: number, username: string) {
    await deleteMessageMutation
      .mutateAsync({
        id,
        username,
      })
      .then(() => {
        refetch();
      });
  }

  if (isPending) return <LoadingReactQuery />;
  if (isError) return <ErrorReactQuery />;

  const guestbook: Omit<GuestbookProps, "email">[] = data;

  const sortedGuestbookByDate = guestbook.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <>
      <NextSeo
        title="guestbook.ekel.dev"
        description="Write a message for me and others"
      />
      <Box w="full" py={4}>
        <Container spaceY={5} maxW="3xl">
          <Box spaceY={4}>
            <Box spaceY={2}>
              <Heading as="h1" fontSize="3xl" w="fit" fontWeight="extrabold">
                guestbook.ekel.dev
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
              <HStack>
                <Button fontWeight="bold" onClick={() => signIn("github")}>
                  <FaGithub /> Github
                </Button>
                <Button fontWeight="bold" onClick={() => signIn("google")}>
                  <FaGoogle /> Google
                </Button>
              </HStack>
            ) : (
              <Button onClick={() => setIsCreateNewMessage(true)}>
                Create your message
              </Button>
            )}
          </Box>
          <Box spaceY={4}>
            {sortedGuestbookByDate.map((item) => (
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
                {session?.user.email === NEXT_PUBLIC_ADMIN_EMAIL ? (
                  <HStack>
                    <button
                      type="button"
                      aria-label="delete message"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleDeleteMessage(item.id, item.username)
                      }
                    >
                      <Text
                        fontWeight="bold"
                        textDecoration="underline"
                        fontSize="14px"
                      >
                        Delete
                      </Text>
                    </button>
                  </HStack>
                ) : null}
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      {/** Dialog Create New Message */}
      <DialogRoot
        placement="center"
        open={isCreateNewMessage}
        onOpenChange={(e) => setIsCreateNewMessage(e.open)}
        size={{ base: "sm", sm: "lg" }}
        preventScroll
        lazyMount
      >
        <DialogBackdrop />
        <DialogContent bg="gray.900">
          <DialogHeader>
            <DialogTitle>Create New Message</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogBody>
              <Textarea
                {...register("message", { required: true })}
                placeholder="Your Message...."
                borderColor="gray.500"
                h="80px"
                _placeholder={{ color: "gray.500" }}
                required
              />
              <Text>{errors.message ? errors.message.message : null}</Text>
            </DialogBody>
            <DialogFooter>
              <Button
                type="submit"
                aria-label="submit"
                variant="surface"
                fontWeight="bold"
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
          <DialogCloseTrigger color="white" _hover={{ bg: "none" }} />
        </DialogContent>
      </DialogRoot>
    </>
  );
}
