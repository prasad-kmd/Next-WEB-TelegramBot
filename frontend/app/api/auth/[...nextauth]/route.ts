import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const users = [];
        for (let i = 1; i <= 3; i++) {
          const email = process.env[`NEXTAUTH_USER${i}_EMAIL`];
          const password = process.env[`NEXTAUTH_USER${i}_PASSWORD`];
          const name = process.env[`NEXTAUTH_USER${i}_NAME`] || `User ${i}`;

          if (email && password) {
            users.push({ id: i.toString(), email, password, name });
          }
        }

        if (users.length === 0 || !process.env.NEXTAUTH_USER1_EMAIL || !process.env.NEXTAUTH_USER1_PASSWORD) {
          throw new Error("NEXTAUTH_USER1_EMAIL and NEXTAUTH_USER1_PASSWORD must be set");
        }

        const user = users.find((u) => u.email === credentials.email);

        if (!user) {
          return null;
        }

        const isMatch = user.password.startsWith("$2b")
          ? await bcrypt.compare(credentials.password, user.password)
          : crypto.timingSafeEqual(
              Buffer.from(credentials.password),
              Buffer.from(user.password)
            );

        if (isMatch) {
          return { id: user.id, name: user.name, email: user.email };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
