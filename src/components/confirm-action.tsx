import { AlertDialog, Button } from "@heroui/react";

export function ConfirmAction({
  triggerLabel,
  triggerVariant,
  title,
  description,
  actionLabel,
  isPending,
  onConfirm,
}: {
  triggerLabel: string;
  triggerVariant: "tertiary" | "danger" | "danger-soft";
  title: string;
  description: string;
  actionLabel: string;
  isPending: boolean;
  onConfirm: () => Promise<unknown>;
}) {
  async function handleConfirm(close: () => void) {
    try {
      await onConfirm();
      close();
    } catch {
      // Mutation callbacks report the failure and keep the confirmation open.
    }
  }

  return (
    <AlertDialog>
      <Button size="sm" variant={triggerVariant}>
        {triggerLabel}
      </Button>
      <AlertDialog.Backdrop variant="blur" isDismissable>
        <AlertDialog.Container placement="center" size="sm">
          <AlertDialog.Dialog>
            {function renderConfirmation({ close }) {
              return (
                <>
                  <AlertDialog.Header>
                    <AlertDialog.Icon status="danger" />
                    <AlertDialog.Heading>{title}</AlertDialog.Heading>
                  </AlertDialog.Header>
                  <AlertDialog.Body>{description}</AlertDialog.Body>
                  <AlertDialog.Footer>
                    <Button slot="close" variant="outline">
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      isPending={isPending}
                      onPress={function handleConfirmPress() {
                        void handleConfirm(close);
                      }}
                    >
                      {actionLabel}
                    </Button>
                  </AlertDialog.Footer>
                </>
              );
            }}
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
