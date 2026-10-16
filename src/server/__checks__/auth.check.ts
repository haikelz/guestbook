// Run: npx tsx src/server/__checks__/auth.check.ts
// Fails if guestbook mutations stop requiring a session or admin role.
import assert from "node:assert/strict";
import { createCaller } from "../routers/_app";

async function code(fn: () => Promise<unknown>) {
  try {
    await fn();
    return "OK";
  } catch (error) {
    return (error as { code?: string }).code;
  }
}

const anon = createCaller({ session: null });
const guest = createCaller({
  session: { user: { role: "guest", email: "g@x.dev", name: "g" }, expires: "" } as never,
});

void (async () => {
  assert.equal(await code(() => anon.guestbook.post({ message: "hi" })), "UNAUTHORIZED");
  assert.equal(await code(() => guest.guestbook.post({ message: "x".repeat(501) })), "BAD_REQUEST");
  assert.equal(await code(() => guest.guestbook.post({ message: "   " })), "BAD_REQUEST");
  assert.equal(await code(() => guest.guestbook.deleteAllUsers()), "FORBIDDEN");
  assert.equal(await code(() => anon.guestbook.getWithEmail({ key: "k" })), "UNAUTHORIZED");
  console.log("auth checks passed");
})();
