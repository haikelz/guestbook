import {
  NEXT_PUBLIC_GITHUB_ID,
  NEXT_PUBLIC_GITHUB_SECRET,
  NEXT_PUBLIC_GITHUB_USERNAME,
  NEXTAUTH_SECRET,
} from "@/lib/utils/constants";
import type { Awaitable, NextAuthOptions, User } from "next-auth";
import NextAuth from "next-auth/next";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";

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
            profile.login === NEXT_PUBLIC_GITHUB_USERNAME ? "admin" : "guest",
          name: profile.name,
          id: profile.id.toString(),
          image: profile.avatar_url,
        };
      },
      clientId: NEXT_PUBLIC_GITHUB_ID,
      clientSecret: NEXT_PUBLIC_GITHUB_SECRET,
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
