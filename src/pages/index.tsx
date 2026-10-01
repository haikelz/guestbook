import ErrorReactQuery from "@/components/error-react-query";
import LoadingReactQuery from "@/components/loading-react-query";
import { ThemeToggle } from "@/components/theme-toggle";
import { useColorTheme } from "@/hooks/use-color-theme";
import { dateFormatter } from "@/lib/helpers/date-formatter";
import { NEXT_PUBLIC_ADMIN_EMAIL } from "@/lib/utils/constants";
import { messageSchema } from "@/lib/utils/schemas";
import { trpc } from "@/lib/utils/trpc";
import type { GuestbookProps } from "@/types";
import { Alert, Button, Modal, TextArea } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import Link from "next/link";
import { createDetector } from "profanity-kit/core";
import { english } from "profanity-kit/languages/en";
import { indonesian } from "profanity-kit/languages/id";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiChevronRight } from "react-icons/bi";
import { FaGithub, FaGoogle } from "react-icons/fa";

const AnimatedContent = dynamic(
  () => import("@/components/react-bits/animated-content"),
  { ssr: false },
);

type GuestbookMessage = Omit<GuestbookProps, "email">;

export default function Guestbook() {
  const detector = createDetector({ languages: [english, indonesian] });
  const { theme, toggleTheme } = useColorTheme();
  const [notice, setNotice] = useState<{
    message: string;
    status: "success" | "danger";
  } | null>(null);
  const { refetch, data, isPending, isError } = trpc.guestbook.get.useQuery(
    { key: "get-guestbook" },
    {
      placeholderData: keepPreviousData,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );
  const { data: session } = useSession();

  const deleteMessageMutation = trpc.guestbook.delete.useMutation({
    onSuccess: async function onDeleteSuccess() {
      await refetch();
      setNotice({ message: "Message deleted.", status: "success" });
    },
    onError: function onDeleteError() {
      setNotice({
        message: "Could not delete this message. Please try again.",
        status: "danger",
      });
    },
  });

  function handleDeleteMessage(id: number, username: string) {
    deleteMessageMutation.mutate({ id, username });
  }

  if (isPending) return <LoadingReactQuery />;
  if (isError) return <ErrorReactQuery />;

  const sortedGuestbook = (data ?? [])
    .map((item) => ({ ...item, message: detector.filter(item.message) }))
    .sort(
      (first, second) =>
        new Date(second.created_at).getTime() -
        new Date(first.created_at).getTime(),
    );

  return (
    <>
      <NextSeo
        title="guestbook.ekel.dev"
        description="Write a message for me and others"
      />
      <main className="guestbook-viewport">
        <div className="guestbook-page">
          {notice && (
            <Alert
              className="guestbook-notice"
              status={notice.status}
              role="status"
            >
              <Alert.Indicator />
              <Alert.Content>{notice.message}</Alert.Content>
            </Alert>
          )}
          {session?.user.role === "admin" && <GoToDashboardAdmin />}
          <AnimatedContent
            distance={150}
            direction="horizontal"
            duration={0.8}
            reverse={true}
            ease="power3.out"
          >
            <header className="guestbook-header">
              <div>
                <p className="guestbook-eyebrow">
                  A small corner of the internet
                </p>
                <h1>guestbook.ekel.dev</h1>
                <p className="guestbook-intro">
                  Write a message for me and others.
                  {session && (
                    <Button
                      className="guestbook-sign-out"
                      size="sm"
                      variant="tertiary"
                      onPress={function handleSignOut() {
                        void signOut();
                      }}
                    >
                      Sign out
                    </Button>
                  )}
                </p>
              </div>
              <div className="guestbook-header-actions">
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                {session ? (
                  <DialogCreateMessage
                    onCreated={function handleMessageCreated() {
                      void refetch();
                      setNotice({
                        message: "Your message has been added.",
                        status: "success",
                      });
                    }}
                    onError={function handleMessageError() {
                      setNotice({
                        message:
                          "Could not add your message. Please try again.",
                        status: "danger",
                      });
                    }}
                  />
                ) : (
                  <div className="guestbook-sign-in-actions">
                    <Button
                      variant="secondary"
                      onPress={function handleGitHubSignIn() {
                        void signIn("github");
                      }}
                    >
                      <FaGithub aria-hidden="true" />
                      Continue with GitHub
                    </Button>
                    <Button
                      variant="primary"
                      onPress={function handleGoogleSignIn() {
                        void signIn("google");
                      }}
                    >
                      <FaGoogle aria-hidden="true" />
                      Continue with Google
                    </Button>
                  </div>
                )}
              </div>
            </header>
          </AnimatedContent>

          <AnimatedContent
            direction="vertical"
            duration={0.8}
            ease="power3.out"
          >
            <section className="guestbook-feed" aria-label="Guestbook messages">
              <div className="guestbook-feed-heading">
                <div>
                  <h2>Recent messages</h2>
                  <p>A collection of notes from the community.</p>
                </div>
                <span className="guestbook-message-count">
                  {sortedGuestbook.length} messages
                </span>
              </div>
              {sortedGuestbook.length ? (
                <div className="guestbook-message-list">
                  {sortedGuestbook.map(function renderMessage(
                    item: GuestbookMessage,
                  ) {
                    return (
                      <article className="guestbook-message" key={item.id}>
                        <div className="guestbook-message-topline">
                          <span className="guestbook-author">
                            @{item.username}
                          </span>
                          <time
                            dateTime={new Date(item.created_at).toISOString()}
                          >
                            {dateFormatter.format(new Date(item.created_at))}
                          </time>
                        </div>
                        <p>{item.message}</p>
                        {session?.user.email === NEXT_PUBLIC_ADMIN_EMAIL && (
                          <Button
                            className="guestbook-delete-message"
                            size="sm"
                            variant="danger"
                            isPending={deleteMessageMutation.isPending}
                            onPress={function handleDelete() {
                              void handleDeleteMessage(item.id, item.username);
                            }}
                          >
                            Delete message
                          </Button>
                        )}
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="guestbook-empty-state">
                  <span className="guestbook-empty-mark" aria-hidden="true" />
                  <h3>No messages yet</h3>
                  <p>Sign in and leave the first note.</p>
                </div>
              )}
            </section>
          </AnimatedContent>
          <footer className="guestbook-footer">
            <span>Made for good conversations.</span>
            <span>guestbook.ekel.dev</span>
          </footer>
        </div>
      </main>
    </>
  );
}

function GoToDashboardAdmin() {
  return (
    <Link className="guestbook-admin-link" href="/dashboard/admin">
      Admin dashboard <BiChevronRight aria-hidden="true" />
    </Link>
  );
}

function DialogCreateMessage({
  onCreated,
  onError,
}: {
  onCreated: () => void;
  onError: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{ message: string }>({
    defaultValues: { message: "" },
    resolver: zodResolver(messageSchema),
  });
  const { data: session } = useSession();
  const createMessageMutation = trpc.guestbook.post.useMutation();

  async function handleCreateMessage(values: { message: string }) {
    const email = session?.user.email;
    const username = session?.user.name?.trim() || email?.split("@")[0];
    if (!email || !username) return;

    try {
      await createMessageMutation.mutateAsync({
        email,
        username,
        message: values.message,
      });
      setValue("message", "");
      setIsOpen(false);
      onCreated();
    } catch {
      onError();
    }
  }

  return (
    <>
      <Button
        variant="primary"
        onPress={function handleOpenCreateMessage() {
          setIsOpen(true);
        }}
      >
        Write a message
      </Button>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Container>
          <Modal.Dialog className="guestbook-create-dialog">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Create a message</Modal.Heading>
              <p className="guestbook-dialog-description">
                Share a short note with the guestbook community.
              </p>
            </Modal.Header>
            <form onSubmit={handleSubmit(handleCreateMessage)}>
              <Modal.Body>
                <TextArea
                  {...register("message")}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                  aria-label="Your message"
                  aria-invalid={Boolean(errors.message)}
                  autoFocus
                  className="guestbook-message-input"
                  maxLength={500}
                  placeholder="Write your message…"
                  required
                  rows={5}
                />
                {errors.message && (
                  <p className="guestbook-field-error" id="message-error">
                    {errors.message.message}
                  </p>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  slot="close"
                  onPress={function handleCancel() {
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  aria-label="Submit message"
                  isPending={createMessageMutation.isPending}
                  type="submit"
                  variant="primary"
                >
                  Publish message
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
