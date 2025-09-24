import ErrorReactQuery from "@/components/error-react-query";
import LoadingReactQuery from "@/components/loading-react-query";
import { toaster } from "@/components/ui/toaster";
import { dateFormatter } from "@/lib/helpers/date-formatter";
import { NEXT_PUBLIC_ADMIN_EMAIL } from "@/lib/utils/constants";
import { messageSchema } from "@/lib/utils/schemas";
import { trpc } from "@/lib/utils/trpc";
import { GuestbookProps } from "@/types";
import {
  Box,
  Button,
  CloseButton,
  Container,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Flex,
  Heading,
  HStack,
  Portal,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import { signIn, signOut, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { BiChevronRight } from "react-icons/bi";
import { FaGithub, FaGoogle } from "react-icons/fa";

const AnimatedContent = dynamic(
  () => import("@/components/react-bits/animated-content"),
  {
    ssr: false,
  }
);

const isOpenCreateMessageAtom = atom(false);

export default function Guestbook() {
  const queryClient = useQueryClient();

  const [isOpenCreateMessage, setIsOpenCreateMessage] = useAtom(
    isOpenCreateMessageAtom
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

  // only for admin
  const deleteMessageMutation = trpc.guestbook.delete.useMutation({
    mutationKey: ["delete-message"],
    onSuccess: async () =>
      await queryClient
        .invalidateQueries({
          queryKey: ["delete-message"],
          exact: true,
        })
        .then(() => {
          toaster.create({
            type: "success",
            title: "Berhasil menghapus pesan ini!",
          });
        }),
    onError: () => {
      toaster.create({
        type: "error",
        title: "Gagal menghapus pesan ini!",
      });
    },
  });

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

  console.log(session);

  return (
    <>
      <NextSeo
        title="guestbook.ekel.dev"
        description="Write a message for me and others"
      />
      <Box w="full" py={4}>
        {session && session.user.role === "admin" ? (
          <GoToDashboardAdmin />
        ) : null}
        <Container spaceY={5} maxW="3xl">
          <AnimatedContent
            distance={150}
            direction="horizontal"
            duration={0.8}
            reverse={true}
            ease="power3.out"
          >
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
                <DialogCreateMessage refetch={refetch} />
              )}
            </Box>
          </AnimatedContent>
          <AnimatedContent
            direction="vertical"
            duration={0.8}
            ease="power3.out"
          >
            <Box
              spaceY={4}
              overflowY="scroll"
              minH="100vh"
              maxH="100vh"
              pb={44}
            >
              {sortedGuestbookByDate.map((item, index) => (
                <Box
                  spaceY={1}
                  p={2}
                  border="1px solid"
                  borderColor="gray.500"
                  borderRadius="sm"
                  backgroundColor="gray.950"
                  key={item.id}
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
          </AnimatedContent>
        </Container>
      </Box>
    </>
  );
}

function GoToDashboardAdmin() {
  return (
    <Link href="/dashboard/admin">
      <Button pos="fixed" top={4} right={4}>
        <Text>Go to Dashboard Admin</Text>
        <BiChevronRight />
      </Button>
    </Link>
  );
}

function DialogCreateMessage({ refetch }: { refetch: () => void }) {
  const [isOpenCreateMessage, setIsOpenCreateMessage] = useAtom(
    isOpenCreateMessageAtom
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
      });

    setIsOpenCreateMessage(false);
  }

  const createNewMessageMutation = trpc.guestbook.post.useMutation({
    mutationKey: ["create-new-message"],
  });

  const { data: session } = useSession();

  return (
    <DialogRoot
      placement="center"
      size={{ base: "sm", sm: "lg" }}
      preventScroll
      lazyMount
      open={isOpenCreateMessage}
      onOpenChange={(details) => setIsOpenCreateMessage(details.open)}
    >
      <DialogBackdrop />
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpenCreateMessage(true)}>
          Create New Message
        </Button>
      </DialogTrigger>
      <Portal>
        <DialogPositioner>
          <DialogContent bg="gray.900">
            <DialogCloseTrigger color="white" _hover={{ bg: "none" }} asChild>
              <CloseButton size="2xs" />
            </DialogCloseTrigger>
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
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
}
