import ErrorReactQuery from "@/components/error-react-query";
import LoadingReactQuery from "@/components/loading-react-query";
import { toaster } from "@/components/ui/toaster";
import { trpc } from "@/lib/utils/trpc";
import {
  Button,
  CloseButton,
  DialogBackdrop,
  DialogBody,
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
} from "@chakra-ui/react";
import { keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { FaTrash } from "react-icons/fa";

export default function DashboardAdminPage() {
  const { data: session } = useSession();
  const { data, isPending, isError } = trpc.guestbook.getWithEmail.useQuery(
    { key: "get-guestbook" },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    }
  );

  if (isPending) return <LoadingReactQuery />;
  if (isError) return <ErrorReactQuery />;

  const usersListWithoutDuplicate = data?.reduce((acc, item) => {
    if (!acc.includes(item.email)) {
      return [...acc, item.email];
    }
    return acc;
  }, [] as string[]);

  const handleClick = (email: string) => {
    console.log(email);
  };

  return (
    <Stack>
      {/** Navbar */} {/** Sidebar */}
      {/** Content */}
      {/** Footer */}
      <Heading>Dashboard Admin</Heading>
      <Stack>
        Daftar User:
        <Grid
          templateColumns="repeat(4, 1fr)"
          gap={2}
          border="1px solid"
          borderColor="gray.500"
          borderRadius="sm"
          p={2}
        >
          {usersListWithoutDuplicate?.map((item) => (
            <GridItem
              key={item}
              border="1px solid"
              borderColor="gray.500"
              borderRadius="sm"
              p={2}
            >
              <HStack>
                <Text>{item}</Text>
                <DialogDeleteUser email={item} />
              </HStack>
            </GridItem>
          ))}
        </Grid>
      </Stack>
      <DrawerRoot>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            Open Drawer
          </Button>
        </DrawerTrigger>
        <Portal>
          <DrawerBackdrop />
          <DrawerPositioner>
            <DrawerContent>
              <DrawerCloseTrigger asChild>
                <CloseButton size="sm" />
              </DrawerCloseTrigger>
              <DrawerHeader>
                <DrawerTitle>{session?.user.name}</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <p>{session?.user.email}</p>
              </DrawerBody>
            </DrawerContent>
          </DrawerPositioner>
        </Portal>
      </DrawerRoot>
    </Stack>
  );
}

function DialogDeleteUser({ email }: { email: string }) {
  const deleteByEmailMutation = trpc.guestbook.deleteByEmail.useMutation();

  async function handleDelete() {
    await deleteByEmailMutation.mutateAsync({ email }).then(() => {
      toaster.create({
        type: "success",
        title: "User deleted successfully",
      });
    });
  }

  return (
    <DialogRoot>
      <DialogTrigger>
        <Button size="2xs">
          <FaTrash />
        </Button>
      </DialogTrigger>
      <DialogBackdrop />
      <Portal>
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text>Are you sure you want to delete this user?</Text>
            </DialogBody>
            <DialogFooter>
              <Button onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
}
