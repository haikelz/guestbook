import type { Awaitable, NextAuthOptions, User } from "next-auth";
import NextAuth from "next-auth/next";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

// Server-only: a NEXT_PUBLIC_ prefix would let Next inline these into client bundles.
const {
  ADMIN_EMAIL,
  GITHUB_ID = "",
  GITHUB_SECRET = "",
  GITHUB_USERNAME,
  GOOGLE_ID = "",
  GOOGLE_SECRET = "",
  NEXTAUTH_SECRET,
} = process.env;

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
