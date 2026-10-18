import { ConfirmAction } from "@/components/confirm-action";
import { ThemeToggle } from "@/components/theme-toggle";
import { useColorTheme } from "@/hooks/use-color-theme";
import { dateFormatter } from "@/lib/helpers/date-formatter";
import { SITE_URL } from "@/lib/utils/constants";
import { messageSchema } from "@/lib/utils/schemas";
import { trpc } from "@/lib/utils/trpc";
import { createCaller } from "@/server/routers/_app";
import type { GuestbookProps } from "@/types";
import { Alert, Button, Modal, TextArea } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { createDetector } from "profanity-kit/core";
import { english } from "profanity-kit/languages/en";
import { indonesian } from "profanity-kit/languages/id";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { LuArrowUpRight, LuMessageSquare, LuPenLine } from "react-icons/lu";

type GuestbookMessage = Omit<GuestbookProps, "email">;

type GuestbookPageProps = {
  initialMessages: GuestbookMessage[] | null;
};

const PAGE_TITLE = "Guestbook · ekel.dev";
const PAGE_DESCRIPTION =
  "Leave a note for Haikel and read messages from visitors to ekel.dev.";

// Render messages into the HTML so crawlers and link previews see real content.
export const getServerSideProps: GetServerSideProps<GuestbookPageProps> =
  async function getGuestbookProps({ res }) {
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );

    try {
      const initialMessages = await createCaller({ session: null }).guestbook.get({
        key: "get-guestbook",
      });
      return { props: { initialMessages } };
    } catch {
      // The client query retries and shows its own error state.
      return { props: { initialMessages: null } };
    }
  };

const detector = createDetector({ languages: [english, indonesian] });

export default function Guestbook({ initialMessages }: GuestbookPageProps) {
  const { theme, toggleTheme } = useColorTheme();
  const [notice, setNotice] = useState<{
    message: string;
    status: "success" | "danger";
  } | null>(null);
  const { refetch, data, isPending, isError } = trpc.guestbook.get.useQuery(
    { key: "get-guestbook" },
    {
      initialData: initialMessages ?? undefined,
      placeholderData: keepPreviousData,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );
  const { data: session, status: sessionStatus } = useSession();

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
    return deleteMessageMutation.mutateAsync({ id, username });
  }

  const sortedGuestbook = (data ?? [])
    .map((item) => ({ ...item, message: detector.filter(item.message) }))
    .sort(
      (first, second) =>
        new Date(second.created_at).getTime() -
        new Date(first.created_at).getTime(),
    );

  return (
    <>
      <Head>
        <title key="title">{PAGE_TITLE}</title>
        <meta key="description" name="description" content={PAGE_DESCRIPTION} />
        <link key="canonical" rel="canonical" href={`${SITE_URL}/`} />
        <meta key="og:url" property="og:url" content={`${SITE_URL}/`} />
        <meta key="og:title" property="og:title" content={PAGE_TITLE} />
        <meta key="og:description" property="og:description" content={PAGE_DESCRIPTION} />
      </Head>
      <div className="guestbook-viewport">
        <header className="site-topbar">
          <div className="topbar-inner">
            <Link href="/" className="site-brand">
              <Image
                src="https://avatars.githubusercontent.com/u/77146709?v=4"
                alt=""
                width={28}
                height={28}
                className="site-brand-mark"
              />
              <span>
                guestbook<span className="brand-domain">.ekel.dev</span>
              </span>
            </Link>
            <nav className="site-actions" aria-label="Account and appearance">
              {session?.user.role === "admin" && <GoToDashboardAdmin />}
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              {session && (
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={function handleSignOut() {
                    void signOut();
                  }}
                >
                  Sign out
                </Button>
              )}
            </nav>
          </div>
        </header>
        <main className="guestbook-page">
          <section
            className="guestbook-header"
            aria-labelledby="guestbook-title"
          >
            <div className="guestbook-welcome-copy">
              <h1 id="guestbook-title">Guestbook</h1>
              <p className="guestbook-intro">
                {session
                  ? `Signed in as ${session.user.name || session.user.email}. Leave a note for me and others.`
                  : "Write a message for me and others."}
              </p>
            </div>
            <div className="guestbook-header-actions">
              {sessionStatus === "loading" ? (
                <p className="guestbook-auth-caption" role="status">
                  Checking sign-in…
                </p>
              ) : session ? (
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
                      message: "Could not add your message. Please try again.",
                      status: "danger",
                    });
                  }}
                />
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={function handleGitHubSignIn() {
                      void signIn("github");
                    }}
                  >
                    <FaGithub aria-hidden="true" />
                    Continue with GitHub
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={function handleGoogleSignIn() {
                      void signIn("google");
                    }}
                  >
                    <FaGoogle aria-hidden="true" />
                    Continue with Google
                  </Button>
                </>
              )}
            </div>
          </section>
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
          <section
            className="guestbook-feed"
            aria-labelledby="guestbook-feed-title"
          >
            <div className="guestbook-feed-heading">
              <h2 id="guestbook-feed-title">Messages</h2>
              <span className="guestbook-message-count">
                {isPending || isError ? "" : sortedGuestbook.length}
              </span>
            </div>
            {isPending ? (
              <div className="guestbook-state" role="status">
                Loading messages…
              </div>
            ) : isError ? (
              <div className="guestbook-state">
                <h3>Messages couldn't load</h3>
                <p role="alert">Please try again in a moment.</p>
                <Button
                  size="sm"
                  variant="outline"
                  onPress={function handleRetry() {
                    void refetch();
                  }}
                >
                  Try again
                </Button>
              </div>
            ) : sortedGuestbook.length ? (
              <div className="guestbook-message-list">
                {sortedGuestbook.map(function renderMessage(
                  item: GuestbookMessage,
                ) {
                  return (
                    <article className="guestbook-message" key={item.id}>
                      <span className="guestbook-avatar" aria-hidden="true">
                        {item.username.slice(0, 1).toUpperCase()}
                      </span>
                      <div className="guestbook-message-content">
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
                        {session?.user.role === "admin" && (
                          <div className="guestbook-delete-message">
                            <ConfirmAction
                              triggerLabel="Delete"
                              triggerVariant="tertiary"
                              title="Delete this message?"
                              description="This permanently removes the message from the public guestbook."
                              actionLabel="Delete message"
                              isPending={deleteMessageMutation.isPending}
                              onConfirm={function handleDelete() {
                                return handleDeleteMessage(
                                  item.id,
                                  item.username,
                                );
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="guestbook-empty-state">
                <LuMessageSquare className="empty-icon" aria-hidden="true" />
                <h3>No messages yet</h3>
                <p>Sign in and leave the first note.</p>
              </div>
            )}
          </section>
        </main>
        <footer className="guestbook-footer">
          <div className="footer-inner">
            <span>guestbook.ekel.dev</span>
          </div>
        </footer>
      </div>
    </>
  );
}

function GoToDashboardAdmin() {
  return (
    <Link className="guestbook-admin-link" href="/dashboard/admin">
      Dashboard <LuArrowUpRight aria-hidden="true" />
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
  const createMessageMutation = trpc.guestbook.post.useMutation();

  async function handleCreateMessage(values: { message: string }) {
    try {
      await createMessageMutation.mutateAsync({
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
        size="sm"
        variant="primary"
        onPress={function handleOpenCreateMessage() {
          setIsOpen(true);
        }}
      >
        <LuPenLine aria-hidden="true" />
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
                  variant="outline"
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
