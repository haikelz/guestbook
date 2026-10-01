import { Alert } from "@heroui/react";

export default function ErrorReactQuery() {
  return (
    <main className="guestbook-state-page">
      <Alert status="danger" role="alert">
        <Alert.Indicator />
        <Alert.Content>
          Could not load guestbook messages. Try again later.
        </Alert.Content>
      </Alert>
    </main>
  );
}
