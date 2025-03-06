import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { prisma } from "./prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      role: Role;
      device_id?: string;
    } & DefaultSession["user"];
  }
}

enum Role {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    name: string;
    email: string;
    role: Role;
    device_id?: string;
  }
}

export default {
  providers: [
    Credentials({
      async authorize(credentials: any) {
        const { student_phone, password } = credentials;

        const user = await prisma.user.findFirst({
          where: {
            student_phone,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password!);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.full_name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userData = await prisma.user.findUnique({
          where: {
            id: user.id,
          },
        });

        await prisma.session.deleteMany({
          where: {
            userId: user.id,
          },
        });

        const deviceId = uuidv4();

        await prisma.session.create({
          data: {
            userId: user.id!,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            device_id: deviceId,
          },
        });

        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: userData?.role,
          device_id: deviceId,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user as any;

      return session;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
  },
  trustHost: true,
} satisfies NextAuthConfig;
