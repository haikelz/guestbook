import { ThemeToggle } from "@/components/theme-toggle";
import { useColorTheme } from "@/hooks/use-color-theme";
import { dateFormatter } from "@/lib/helpers/date-formatter";
import { messageSchema } from "@/lib/utils/schemas";
import { trpc } from "@/lib/utils/trpc";
import type { GuestbookProps } from "@/types";
import { Alert, Button, Modal, TextArea } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { createDetector } from "profanity-kit/core";
import { english } from "profanity-kit/languages/en";
import { indonesian } from "profanity-kit/languages/id";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuArrowUpRight, LuMessageSquare, LuPenLine } from "react-icons/lu";
import { FaGithub, FaGoogle } from "react-icons/fa";

type GuestbookMessage = Omit<GuestbookProps, "email">;

const detector = createDetector({ languages: [english, indonesian] });

export default function Guestbook() {
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
      <NextSeo
        title="guestbook.ekel.dev"
        description="Write a message for me and others"
      />
      <div className="guestbook-viewport">
        <div className="guestbook-page">
          <header className="site-topbar">
            <Link href="/" className="site-brand">
              <span className="site-brand-mark"><LuMessageSquare aria-hidden="true" /></span>
              guestbook<span className="brand-domain">.ekel.dev</span>
            </Link>
            <nav className="site-actions" aria-label="Account and appearance">
              {session?.user.role === "admin" && <GoToDashboardAdmin />}
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              {session && <Button size="sm" variant="tertiary" onPress={function handleSignOut() { void signOut(); }}>Sign out</Button>}
            </nav>
          </header>
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
          <main className="guestbook-layout">
            <header className="guestbook-header">
              <LuMessageSquare className="welcome-icon" aria-hidden="true" />
              <div className="guestbook-welcome-copy">
                <h1>A little hello.<br />A lasting note.</h1>
                <p className="guestbook-intro">
                  Write a message for me and others.
                  <br />Glad you stopped by.
                </p>
              </div>
              <div className="guestbook-header-actions">
                <p className="guestbook-auth-caption">{session ? `Signed in as ${session.user.name || session.user.email}` : "Sign in to leave your mark."}</p>
                  {sessionStatus === "loading" ? <p role="status">Checking sign-in…</p> : session ? (
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
                      variant="secondary"
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
              <p className="guestbook-welcome-footer">A small corner for good conversations.</p>
            </header>
            <section className="guestbook-feed" aria-label="Guestbook messages">
              <div className="guestbook-feed-heading">
                <div>
                  <h2>The conversation</h2>
                  <p>Notes from everyone who stopped by.</p>
                </div>
                <span className="guestbook-message-count">
                  {isPending || isError ? "" : `${sortedGuestbook.length} messages`}
                </span>
              </div>
              {isPending ? <div className="guestbook-state" role="status">Loading messages…</div> : isError ? <div className="guestbook-state"><h3>Messages couldn't load</h3><p role="alert">Please try again in a moment.</p><Button variant="secondary" onPress={function handleRetry() { void refetch(); }}>Try again</Button></div> : sortedGuestbook.length ? (
                <div className="guestbook-message-list">
                  {sortedGuestbook.map(function renderMessage(
                    item: GuestbookMessage,
                  ) {
                    return (
                      <article className="guestbook-message" key={item.id}>
                        <span className="guestbook-avatar" aria-hidden="true">{item.username.slice(0, 1).toUpperCase()}</span>
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
                          <ConfirmAction
                            triggerLabel="Delete message"
                            triggerVariant="tertiary"
                            title="Delete this message?"
                            description="This permanently removes the message from the public guestbook."
                            actionLabel="Delete message"
                            isPending={deleteMessageMutation.isPending}
                            onConfirm={function handleDelete() {
                              return handleDeleteMessage(item.id, item.username);
                            }}
                          />
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
            <span>guestbook.ekel.dev</span>
            <span>Thanks for being here.</span>
          </footer>
        </div>
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
import { ConfirmAction } from "@/components/confirm-action";
