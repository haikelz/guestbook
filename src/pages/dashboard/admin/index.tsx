import { ConfirmAction } from "@/components/confirm-action";
import { ProtectedLayout } from "@/components/protected-layout";
import { ThemeToggle } from "@/components/theme-toggle";
import { useColorTheme } from "@/hooks/use-color-theme";
import { trpc } from "@/lib/utils/trpc";
import type { AppRouter } from "@/server/routers/_app";
import {
  Alert,
  Button,
  Input,
  Label,
  Modal,
  Table,
  Tabs,
  TextArea,
  TextField,
} from "@heroui/react";
import { keepPreviousData } from "@tanstack/react-query";
import type { inferRouterOutputs } from "@trpc/server";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { LuArrowUpRight, LuMessageSquare } from "react-icons/lu";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type GuestbookMessage = RouterOutputs["guestbook"]["getWithEmail"][number];
type Contributor = {
  email: string;
  username: string;
  messageCount: number;
  latestMessage: GuestbookMessage["created_at"];
};

export default function DashboardAdminPage() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useColorTheme();
  const [search, setSearch] = useState("");
  const [editingMessage, setEditingMessage] = useState<GuestbookMessage | null>(
    null,
  );
  const [draftMessage, setDraftMessage] = useState("");
  const [notice, setNotice] = useState<{
    title: string;
    tone: "success" | "danger";
  } | null>(null);
  const { data, isPending, isError, refetch } =
    trpc.guestbook.getWithEmail.useQuery(
      { key: "get-guestbook" },
      {
        enabled: session?.user.role === "admin",
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
      },
    );

  const messages = data ?? [];
  const contributors = useMemo(
    function createContributors() {
      const byEmail = new Map<string, Contributor>();

      for (const message of messages) {
        const current = byEmail.get(message.email);
        if (!current) {
          byEmail.set(message.email, {
            email: message.email,
            username: message.username,
            messageCount: 1,
            latestMessage: message.created_at,
          });
          continue;
        }

        current.messageCount += 1;
        if (
          new Date(message.created_at).getTime() >
          new Date(current.latestMessage).getTime()
        ) {
          current.username = message.username;
          current.latestMessage = message.created_at;
        }
      }

      return [...byEmail.values()].sort((first, second) =>
        first.email.localeCompare(second.email),
      );
    },
    [messages],
  );

  const normalizedSearch = search.trim().toLocaleLowerCase();
  const sortedMessages = [...messages].sort(
    (first, second) =>
      new Date(second.created_at).getTime() -
      new Date(first.created_at).getTime(),
  );
  const filteredMessages = sortedMessages.filter(
    function matchesMessage(message) {
      return [message.username, message.email, message.message].some((value) =>
        value.toLocaleLowerCase().includes(normalizedSearch),
      );
    },
  );
  const filteredContributors = contributors.filter(
    function matchesContributor(contributor) {
      return [contributor.username, contributor.email].some((value) =>
        value.toLocaleLowerCase().includes(normalizedSearch),
      );
    },
  );
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const messagesThisMonth = messages.filter(
    (message) => new Date(message.created_at) >= monthStart,
  ).length;

  const updateMessageMutation = trpc.guestbook.put.useMutation({
    onSuccess: async function onUpdateSuccess() {
      await refetch();
      setEditingMessage(null);
      setNotice({ title: "Message updated", tone: "success" });
    },
    onError: function onUpdateError() {
      setNotice({
        title: "Could not update message. Please try again.",
        tone: "danger",
      });
    },
  });
  const deleteMessageMutation = trpc.guestbook.delete.useMutation({
    onSuccess: async function onDeleteSuccess() {
      await refetch();
      setNotice({ title: "Message deleted", tone: "success" });
    },
    onError: function onDeleteError() {
      setNotice({
        title: "Could not delete message. Please try again.",
        tone: "danger",
      });
    },
  });
  const deleteContributorMutation =
    trpc.guestbook.deleteUserByEmail.useMutation({
      onSuccess: async function onDeleteContributorSuccess() {
        await refetch();
        setNotice({ title: "Contributor messages deleted", tone: "success" });
      },
      onError: function onDeleteContributorError() {
        setNotice({
          title: "Could not delete contributor messages. Please try again.",
          tone: "danger",
        });
      },
    });
  const deleteAllMutation = trpc.guestbook.deleteAllUsers.useMutation({
    onSuccess: async function onDeleteAllSuccess() {
      await refetch();
      setNotice({ title: "All messages deleted", tone: "success" });
    },
    onError: function onDeleteAllError() {
      setNotice({
        title: "Could not delete messages. Please try again.",
        tone: "danger",
      });
    },
  });

  function handleEdit(message: GuestbookMessage) {
    setEditingMessage(message);
    setDraftMessage(message.message);
  }

  function handleSaveMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingMessage || !draftMessage.trim()) return;

    updateMessageMutation.mutate({
      id: editingMessage.id,
      message: draftMessage.trim(),
      email: editingMessage.email,
      username: editingMessage.username,
    });
  }

  function handleDeleteMessage(message: GuestbookMessage) {
    return deleteMessageMutation.mutateAsync({
      id: message.id,
      username: message.username,
    });
  }

  function handleDeleteContributor(contributor: Contributor) {
    return deleteContributorMutation.mutateAsync({ email: contributor.email });
  }

  function handleDeleteAllMessages() {
    return deleteAllMutation.mutateAsync();
  }

  return (
    <ProtectedLayout session={session}>
      <div className="dashboard-viewport">
        <header className="dashboard-topbar">
          <div className="topbar-inner">
            <Link className="dashboard-brand" href="/">
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
              <span className="dashboard-brand-divider" aria-hidden="true" />
              <span className="dashboard-brand-section">Admin</span>
            </Link>
            <div className="dashboard-account">
              <span className="dashboard-account-name">
                {session?.user.name ?? session?.user.email}
              </span>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <Button
                size="sm"
                variant="ghost"
                onPress={function handleSignOut() {
                  void signOut({ callbackUrl: "/" });
                }}
              >
                Sign out
              </Button>
            </div>
          </div>
        </header>
        <div className="dashboard-page">
          <main className="dashboard-main">
            {notice && (
              <Alert status={notice.tone}>
                <Alert.Indicator />
                <Alert.Content>{notice.title}</Alert.Content>
              </Alert>
            )}
            <div className="dashboard-heading">
              <div>
                <h1>Dashboard</h1>
                <p className="dashboard-intro">
                  Review the conversation and manage contributor activity.
                </p>
              </div>
              <Link className="dashboard-back-link" href="/">
                View guestbook <LuArrowUpRight aria-hidden="true" />
              </Link>
            </div>

            <section className="dashboard-stats" aria-label="Guestbook summary">
              <SummaryCard
                label="Published messages"
                value={isPending || isError ? "—" : messages.length}
              />
              <SummaryCard
                label="Contributors"
                value={isPending || isError ? "—" : contributors.length}
              />
              <SummaryCard
                label="Messages this month"
                value={isPending || isError ? "—" : messagesThisMonth}
              />
            </section>

            {isPending ? (
              <div className="dashboard-state" role="status">
                Loading guestbook data…
              </div>
            ) : isError ? (
              <div className="dashboard-state dashboard-error">
                <p role="alert">Could not load guestbook data.</p>
                <Button
                  variant="outline"
                  onPress={function handleRetry() {
                    void refetch();
                  }}
                >
                  Try again
                </Button>
              </div>
            ) : (
              <Tabs
                className="dashboard-tabs"
                variant="secondary"
                defaultSelectedKey="messages"
              >
                <Tabs.ListContainer>
                  <Tabs.List aria-label="Guestbook management sections">
                    <Tabs.Tab id="messages">
                      <Tabs.Indicator />
                      Messages{" "}
                      <span className="dashboard-tab-count">
                        {messages.length}
                      </span>
                    </Tabs.Tab>
                    <Tabs.Tab id="contributors">
                      <Tabs.Indicator />
                      Contributors{" "}
                      <span className="dashboard-tab-count">
                        {contributors.length}
                      </span>
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>

                <Tabs.Panel id="messages" className="dashboard-panel">
                  <section
                    className="management-panel"
                    aria-labelledby="messages-title"
                  >
                    <div className="management-heading">
                      <div>
                        <h2 id="messages-title">Guestbook messages</h2>
                        <p>Search, edit, or remove a message.</p>
                      </div>
                      <div className="management-tools">
                        <label
                          className="visually-hidden"
                          htmlFor="message-search"
                        >
                          Search messages
                        </label>
                        <Input
                          id="message-search"
                          className="dashboard-search"
                          type="search"
                          placeholder="Search messages or people"
                          value={search}
                          onChange={function handleMessageSearch(event) {
                            setSearch(event.target.value);
                          }}
                        />
                        {messages.length > 0 ? (
                          <ConfirmAction
                            triggerLabel="Delete all messages"
                            triggerVariant="danger-soft"
                            title="Delete all guestbook messages?"
                            description="This permanently removes every published guestbook message. Contributor accounts are not affected."
                            actionLabel="Delete all messages"
                            isPending={deleteAllMutation.isPending}
                            onConfirm={handleDeleteAllMessages}
                          />
                        ) : null}
                      </div>
                    </div>
                    <p className="management-result-count" aria-live="polite">
                      Showing {filteredMessages.length} of {messages.length}{" "}
                      messages
                    </p>
                    <MessageTable
                      messages={filteredMessages}
                      isDeleting={deleteMessageMutation.isPending}
                      onEdit={handleEdit}
                      onDelete={handleDeleteMessage}
                    />
                  </section>
                </Tabs.Panel>

                <Tabs.Panel id="contributors" className="dashboard-panel">
                  <section
                    className="management-panel"
                    aria-labelledby="contributors-title"
                  >
                    <div className="management-heading">
                      <div>
                        <h2 id="contributors-title">Contributors</h2>
                        <p>Manage guestbook activity by email address.</p>
                      </div>
                      <div className="management-tools">
                        <label
                          className="visually-hidden"
                          htmlFor="contributor-search"
                        >
                          Search contributors
                        </label>
                        <Input
                          id="contributor-search"
                          className="dashboard-search"
                          type="search"
                          placeholder="Search contributors"
                          value={search}
                          onChange={function handleContributorSearch(event) {
                            setSearch(event.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <p className="management-result-count" aria-live="polite">
                      Showing {filteredContributors.length} of{" "}
                      {contributors.length} contributors
                    </p>
                    <ContributorTable
                      contributors={filteredContributors}
                      isDeleting={deleteContributorMutation.isPending}
                      onDelete={handleDeleteContributor}
                    />
                  </section>
                </Tabs.Panel>
              </Tabs>
            )}
          </main>
        </div>
      </div>

      <Modal>
        <Modal.Backdrop
          variant="blur"
          isOpen={editingMessage !== null}
          onOpenChange={function handleEditModalChange(isOpen) {
            if (!isOpen && !updateMessageMutation.isPending) {
              setEditingMessage(null);
            }
          }}
          isDismissable={!updateMessageMutation.isPending}
          isKeyboardDismissDisabled={updateMessageMutation.isPending}
        >
          <Modal.Container placement="center" size="md">
            <Modal.Dialog>
              {function renderEditDialog({ close }) {
                return (
                  <form
                    className="edit-message-form"
                    onSubmit={handleSaveMessage}
                  >
                    <Modal.Header>
                      <div>
                        <Modal.Heading>Edit message</Modal.Heading>
                      </div>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="edit-message-author">
                        <strong>{editingMessage?.username}</strong>
                        <span>{editingMessage?.email}</span>
                      </div>
                      <TextField className="dashboard-field" isRequired>
                        <Label>Message</Label>
                        <TextArea
                          rows={5}
                          value={draftMessage}
                          onChange={function handleDraftChange(event) {
                            setDraftMessage(event.target.value);
                          }}
                          aria-describedby="message-character-count"
                        />
                      </TextField>
                      <p id="message-character-count" className="field-hint">
                        {draftMessage.length} characters
                      </p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        type="button"
                        variant="outline"
                        isDisabled={updateMessageMutation.isPending}
                        onPress={close}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        isPending={updateMessageMutation.isPending}
                        isDisabled={!draftMessage.trim()}
                      >
                        Save changes
                      </Button>
                    </Modal.Footer>
                  </form>
                );
              }}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </ProtectedLayout>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <article className="summary-card">
      <p className="summary-card-label">{label}</p>
      <strong className="summary-card-value">
        {typeof value === "number" ? value.toLocaleString() : value}
      </strong>
    </article>
  );
}

function MessageTable({
  messages,
  isDeleting,
  onEdit,
  onDelete,
}: {
  messages: GuestbookMessage[];
  isDeleting: boolean;
  onEdit: (message: GuestbookMessage) => void;
  onDelete: (message: GuestbookMessage) => Promise<void>;
}) {
  if (messages.length === 0) {
    return (
      <EmptyState
        title="No messages found"
        description="Try a different search or check back later."
      />
    );
  }

  return (
    <>
      <div className="dashboard-table-wrap">
        <Table className="dashboard-table">
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Guestbook messages"
              className="messages-table-content"
            >
              <Table.Header>
                <Table.Column isRowHeader>Message</Table.Column>
                <Table.Column>Contributor</Table.Column>
                <Table.Column>Date</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body>
                {messages.map(function renderMessageRow(message) {
                  return (
                    <Table.Row key={message.id} id={String(message.id)}>
                      <Table.Cell>
                        <p className="message-preview">{message.message}</p>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="table-primary">
                          {message.username}
                        </span>
                        <span className="table-secondary">{message.email}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <time
                          dateTime={new Date(message.created_at).toISOString()}
                        >
                          {formatDate(message.created_at)}
                        </time>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="row-actions">
                          <Button
                            size="sm"
                            variant="tertiary"
                            onPress={function handleEditPress() {
                              onEdit(message);
                            }}
                          >
                            Edit
                          </Button>
                          <ConfirmAction
                            triggerLabel="Delete"
                            triggerVariant="tertiary"
                            title="Delete this message?"
                            description="This message will be permanently removed from the public guestbook."
                            actionLabel="Delete message"
                            isPending={isDeleting}
                            onConfirm={function confirmMessageDelete() {
                              return onDelete(message);
                            }}
                          />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
      <div className="dashboard-mobile-records">
        {messages.map(function renderMobileMessage(message) {
          return (
            <article className="mobile-record" key={message.id}>
              <p className="mobile-record-message">{message.message}</p>
              <div className="mobile-record-meta">
                <strong>{message.username}</strong>
                <span>{message.email}</span>
                <time dateTime={new Date(message.created_at).toISOString()}>
                  {formatDate(message.created_at)}
                </time>
              </div>
              <div className="row-actions">
                <Button
                  size="sm"
                  variant="tertiary"
                  onPress={function handleMobileEditPress() {
                    onEdit(message);
                  }}
                >
                  Edit
                </Button>
                <ConfirmAction
                  triggerLabel="Delete"
                  triggerVariant="tertiary"
                  title="Delete this message?"
                  description="This message will be permanently removed from the public guestbook."
                  actionLabel="Delete message"
                  isPending={isDeleting}
                  onConfirm={function confirmMobileMessageDelete() {
                    return onDelete(message);
                  }}
                />
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function ContributorTable({
  contributors,
  isDeleting,
  onDelete,
}: {
  contributors: Contributor[];
  isDeleting: boolean;
  onDelete: (contributor: Contributor) => Promise<void>;
}) {
  if (contributors.length === 0) {
    return (
      <EmptyState
        title="No contributors found"
        description="Try a different search."
      />
    );
  }

  return (
    <>
      <div className="dashboard-table-wrap">
        <Table className="dashboard-table">
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Guestbook contributors"
              className="contributors-table-content"
            >
              <Table.Header>
                <Table.Column isRowHeader>Contributor</Table.Column>
                <Table.Column>Messages</Table.Column>
                <Table.Column>Latest activity</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body>
                {contributors.map(function renderContributorRow(contributor) {
                  return (
                    <Table.Row key={contributor.email} id={contributor.email}>
                      <Table.Cell>
                        <span className="table-primary">
                          {contributor.username}
                        </span>
                        <span className="table-secondary">
                          {contributor.email}
                        </span>
                      </Table.Cell>
                      <Table.Cell>{contributor.messageCount}</Table.Cell>
                      <Table.Cell>
                        <time
                          dateTime={new Date(
                            contributor.latestMessage,
                          ).toISOString()}
                        >
                          {formatDate(contributor.latestMessage)}
                        </time>
                      </Table.Cell>
                      <Table.Cell>
                        <ConfirmAction
                          triggerLabel="Remove messages"
                          triggerVariant="tertiary"
                          title="Remove this contributor's messages?"
                          description={`This permanently removes ${contributor.messageCount} message${contributor.messageCount === 1 ? "" : "s"} from ${contributor.email}. The sign-in account is not deleted.`}
                          actionLabel="Remove messages"
                          isPending={isDeleting}
                          onConfirm={function confirmContributorDelete() {
                            return onDelete(contributor);
                          }}
                        />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
      <div className="dashboard-mobile-records">
        {contributors.map(function renderMobileContributor(contributor) {
          return (
            <article className="mobile-record" key={contributor.email}>
              <div className="mobile-record-meta">
                <strong>{contributor.username}</strong>
                <span>{contributor.email}</span>
                <span>{contributor.messageCount} messages</span>
                <time
                  dateTime={new Date(contributor.latestMessage).toISOString()}
                >
                  Last active {formatDate(contributor.latestMessage)}
                </time>
              </div>
              <ConfirmAction
                triggerLabel="Remove messages"
                triggerVariant="tertiary"
                title="Remove this contributor's messages?"
                description={`This permanently removes ${contributor.messageCount} message${contributor.messageCount === 1 ? "" : "s"} from ${contributor.email}. The sign-in account is not deleted.`}
                actionLabel="Remove messages"
                isPending={isDeleting}
                onConfirm={function confirmMobileContributorDelete() {
                  return onDelete(contributor);
                }}
              />
            </article>
          );
        })}
      </div>
    </>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="dashboard-empty">
      <LuMessageSquare className="empty-icon" aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function formatDate(date: GuestbookMessage["created_at"]) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}
