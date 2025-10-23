// src/lib/nextauth.ts
import { authService } from "@/services/auth.service";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import type { Session, User, Account } from "next-auth";
import { usersModel } from "@/models/users";

export const nextauth: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember me", type: "text" }, // will be string from form
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await authService.verifyCredentials(
          credentials.email,
          credentials.password
        );
        if (!user) return null;

        // Convert "remember" from string to boolean
        const remember = credentials.remember === "true";

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          remember,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // default 1 day
  },

  secret: process.env.NEXTAUTH_SECRET!,

  callbacks: {
    async signIn({ user, account }: { user: User; account?: Account | null }) {
      // Only allow Google sign-in if user already exists
      if (account?.provider === "google") {
        const existing = await usersModel.findByEmail(user.email!);
        if (!existing) {
          // User does not exist → deny sign-in
          return false;
        }

        // User exists → attach id and remember
        user.id = String(existing.id);
        user.remember = true; // default Google login "remember me" 1 month
      }

      return true;
    },

    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.remember = user.remember ?? false;

        // Set token expiration dynamically based on "remember"
        const now = Math.floor(Date.now() / 1000);
        token.exp = now + (token.remember ? 30 : 1) * 24 * 60 * 60; // 30 days vs 1 day
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.remember = token.remember ?? false;
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  debug: process.env.NODE_ENV === "development",
};
