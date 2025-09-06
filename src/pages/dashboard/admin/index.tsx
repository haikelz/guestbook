import ErrorReactQuery from "@/components/error-react-query";
import LoadingReactQuery from "@/components/loading-react-query";
import { trpc } from "@/lib/utils/trpc";
import {
  Button,
  CloseButton,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  Heading,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { keepPreviousData } from "@tanstack/react-query";

export default function DashboardAdminPage() {
  const { data, isPending, isError } = trpc.guestbook.getByEmail.useQuery(
    { email: "test@test.com" },
    {
      placeholderData: keepPreviousData,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  if (isPending) return <LoadingReactQuery />;
  if (isError) return <ErrorReactQuery />;

  return (
    <Stack>
      {/** Navbar */} {/** Sidebar */}
      {/** Content */}
      {/** Footer */}
      <Heading>Dashboard Admin</Heading>
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
                <DrawerTitle>{}</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </DrawerBody>
            </DrawerContent>
          </DrawerPositioner>
        </Portal>
      </DrawerRoot>
    </Stack>
  );
}
