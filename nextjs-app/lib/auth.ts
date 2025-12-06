import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";

// Extend NextAuth types to support custom fields
declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      name: string;
      id?: string;
      username?: string;
      fullName?: string;
      roles?: string[];
      // Thêm trường balance để lưu số dư tài khoản
      // balance?: number;
    };
    accessToken?: string;
    refreshToken?: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    fullName?: string;
    roles?: string[];
    accessToken?: string;
    refreshToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          });

          const data = await res.json();

          if (res.ok && data.access_token) {
            // Trả về data sẽ được lưu vào session
            return {
              id: data.loggedInUser.id,
              username: data.loggedInUser.username,
              fullName: data.loggedInUser.fullname,
              roles: data.loggedInUser.roles,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              email: data.loggedInUser.email,
            };
          }
          return null;
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as {
          id?: string;
          username?: string;
          fullName?: string;
          roles?: string[];
          accessToken?: string;
          refreshToken?: string;
          email?: string;
          name?: string;
        };
        token.id = u.id;
        token.username = u.username;
        token.fullName = u.fullName;
        token.roles = u.roles;
        token.accessToken = u.accessToken;
        token.refreshToken = u.refreshToken;
        token.email = u.email;
        token.name = u.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        email: token.email ?? "",
        name: token.name ?? "",
        id: token.id,
        username: token.username,
        fullName: token.fullName,
        roles: token.roles,
      };
      session.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: "/page-signin", // custom login page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
