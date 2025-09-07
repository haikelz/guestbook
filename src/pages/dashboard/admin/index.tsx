import ErrorReactQuery from "@/components/error-react-query";
import LoadingReactQuery from "@/components/loading-react-query";
import { ProtectedLayout } from "@/components/protected-layout";
import { toaster } from "@/components/ui/toaster";
import { trpc } from "@/lib/utils/trpc";
import {
  Button,
  CloseButton,
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
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  Grid,
  GridItem,
  Heading,
  HStack,
  Portal,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { keepPreviousData } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { BiMenu } from "react-icons/bi";
import { FaTrash, FaUser } from "react-icons/fa";

export default function DashboardAdminPage() {
  const { data: session } = useSession();
  const { data, isPending, isError, refetch } =
    trpc.guestbook.getWithEmail.useQuery(
      { key: "get-guestbook" },
      {
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
      }
    );

  if (isPending) return <LoadingReactQuery />;
  if (isError) return <ErrorReactQuery />;

  const usersListWithoutDuplicate = data
    ?.reduce((acc, item) => {
      if (!acc.includes(item.email)) {
        return [...acc, item.email];
      }
      return acc;
    }, [] as string[])
    .sort((a, b) => a.localeCompare(b));

  return (
    <ProtectedLayout session={session}>
      <Stack>
        <HStack
          bg="gray.950"
          p={4}
          w="full"
          borderRadius="sm"
          justifyContent="space-between"
          pos="fixed"
          top={0}
          zIndex={1000}
        >
          <Heading>Dashboard Admin</Heading>
          <DrawerRoot>
            <DrawerTrigger asChild>
              <Button size="xs">
                <BiMenu />
              </Button>
            </DrawerTrigger>
            <Portal>
              <DrawerBackdrop />
              <DrawerPositioner>
                <DrawerContent bg="gray.950">
                  <DrawerCloseTrigger
                    asChild
                    color="white"
                    _hover={{ bg: "none" }}
                  >
                    <CloseButton size="sm" />
                  </DrawerCloseTrigger>
                  <DrawerHeader>
                    <DrawerTitle>{session?.user.name}</DrawerTitle>
                  </DrawerHeader>
                  <DrawerBody>
                    {session ? (
                      <>
                        <p>
                          {session?.user.email} ({session?.user.name})
                        </p>
                        <p>{session?.user.role}</p>
                      </>
                    ) : (
                      "Not found"
                    )}
                  </DrawerBody>
                </DrawerContent>
              </DrawerPositioner>
            </Portal>
          </DrawerRoot>
        </HStack>
        <Stack p={4} pt={20}>
          <VStack alignItems="center" gap={8}>
            <Heading>Daftar User</Heading>
            <Grid
              templateColumns={{
                sm: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              }}
              gap={4}
              w="fit"
            >
              {usersListWithoutDuplicate?.map((item) => (
                <GridItem
                  key={item}
                  border="1px solid"
                  borderColor="gray.500"
                  borderRadius="sm"
                  p={2}
                  w="fit"
                >
                  <HStack gap={4}>
                    <FaUser />
                    <Text>{item}</Text>
                    <DialogDeleteUser email={item} refetch={refetch} />
                  </HStack>
                </GridItem>
              ))}
            </Grid>
            <DialogDeleteAllUsers refetch={refetch} />
          </VStack>
        </Stack>
      </Stack>
    </ProtectedLayout>
  );
}

const isOpenDeleteUserAtom = atom<boolean>(false);

function DialogDeleteUser({
  email,
  refetch,
}: {
  email: string;
  refetch: () => void;
}) {
  const [isOpenDeleteUser, setIsOpenDeleteUser] = useAtom(isOpenDeleteUserAtom);

  const deleteByEmailMutation = trpc.guestbook.deleteUserByEmail.useMutation();

  async function handleDelete() {
    await deleteByEmailMutation.mutateAsync({ email }).then(() => {
      toaster.create({
        type: "success",
        title: "User deleted successfully",
      });
      setIsOpenDeleteUser(false);
      refetch();
    });
  }

  return (
    <DialogRoot
      placement="center"
      size={{ base: "sm", sm: "lg" }}
      preventScroll
      lazyMount
      open={isOpenDeleteUser}
      onOpenChange={(details) => setIsOpenDeleteUser(details.open)}
    >
      <DialogBackdrop />
      <DialogTrigger asChild>
        <Button size="2xs">
          <FaTrash />
        </Button>
      </DialogTrigger>
      <Portal>
        <DialogPositioner>
          <DialogContent bg="gray.900">
            <DialogCloseTrigger color="white" _hover={{ bg: "none" }} asChild>
              <CloseButton size="2xs" />
            </DialogCloseTrigger>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text>
                Are you sure you want to delete this user? All of the message
                from this user will be deleted!
              </Text>
            </DialogBody>
            <DialogFooter>
              <Button bg="red" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
}

const isOpenDeleteAllUsersAtom = atom<boolean>(false);

function DialogDeleteAllUsers({ refetch }: { refetch: () => void }) {
  const [isOpenDeleteAllUsers, setIsOpenDeleteAllUsers] = useAtom(
    isOpenDeleteAllUsersAtom
  );

  const deleteAllUsersMutation = trpc.guestbook.deleteAllUsers.useMutation();

  async function handleDeleteAllUsers() {
    await deleteAllUsersMutation.mutateAsync().then(() => {
      toaster.create({
        type: "success",
        title: "All users deleted successfully",
      });
      setIsOpenDeleteAllUsers(false);
      refetch();
    });
  }

  return (
    <DialogRoot
      placement="center"
      size={{ base: "sm", sm: "lg" }}
      preventScroll
      lazyMount
      open={isOpenDeleteAllUsers}
      onOpenChange={(details) => setIsOpenDeleteAllUsers(details.open)}
    >
      <DialogTrigger asChild>
        <Button>Delete All Users</Button>
      </DialogTrigger>
      <DialogBackdrop />
      <Portal>
        <DialogPositioner>
          <DialogContent bg="gray.900">
            <DialogCloseTrigger color="white" _hover={{ bg: "none" }} asChild>
              <CloseButton size="2xs" />
            </DialogCloseTrigger>
            <DialogHeader>
              <DialogTitle>Delete All Users</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text>Are you sure you want to delete all users?</Text>
            </DialogBody>
            <DialogFooter>
              <Button bg="red" onClick={handleDeleteAllUsers}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
}
