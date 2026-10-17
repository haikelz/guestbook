import type { Awaitable, NextAuthOptions, User } from "next-auth";
import NextAuth from "next-auth/next";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

// Read only in this server-side API route, never via a module the client imports,
// so Next does not inline these NEXT_PUBLIC_ values into browser bundles.
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const GITHUB_ID = process.env.NEXT_PUBLIC_GITHUB_ID ?? "";
const GITHUB_SECRET = process.env.NEXT_PUBLIC_GITHUB_SECRET ?? "";
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME;
const GOOGLE_ID = process.env.NEXT_PUBLIC_GOOGLE_ID ?? "";
const GOOGLE_SECRET = process.env.NEXT_PUBLIC_GOOGLE_SECRET ?? "";
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

export const options: NextAuthOptions = {
  theme: {
    colorScheme: "auto",
  },
  providers: [
    GithubProvider({
      profile(profile: GithubProfile): Awaitable<User> {
        return {
          ...profile,
          role:
            profile.login === GITHUB_USERNAME ? "admin" : "guest",
          name: profile.name ?? profile.login,
          id: profile.id.toString(),
          image: profile.avatar_url,
        };
      },
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
    GoogleProvider({
      profile(profile: GoogleProfile): Awaitable<User> {
        return {
          ...profile,
          role: profile.email === ADMIN_EMAIL ? "admin" : "guest",
          name: profile.name ?? profile.email?.split("@")[0] ?? profile.sub,
          id: profile.sub,
          image: profile.picture,
        };
      },
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
  ],
  secret: NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role;
      return session;
    },
  },
};

export default NextAuth(options);
