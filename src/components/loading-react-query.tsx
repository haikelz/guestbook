import { Spinner } from "@heroui/react";

export default function LoadingReactQuery() {
  return (
    <main className="guestbook-state-page" role="status">
      <div className="guestbook-loading-state">
        <Spinner />
        <span>Loading guestbook…</span>
      </div>
    </main>
  );
}
