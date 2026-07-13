import bcrypt from "bcryptjs";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import {
  organization,
  phoneNumber,
  openAPI,
  customSession,
} from "better-auth/plugins";

import { basePrisma } from "../database";
import { stripePlugin } from "./plugins";

const options = {
  plugins: [organization()],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        input: true,
        defaultValue: "CLIENT",
      },
    },
  },
} satisfies BetterAuthOptions;

const sessionMiddleware = customSession(async ({ user, session }) => {
  const dbUser = await basePrisma.users.findUnique({
    select: { role: true },
    where: { id: user.id },
  });

  if (!session.activeOrganizationId) {
    return {
      user: { ...user, role: dbUser?.role },
      session: { ...session, memberRole: null },
    };
  }

  const member = await basePrisma.members.findFirst({
    select: { role: true },
    where: {
      userId: user.id,
      organizationId: session.activeOrganizationId,
    },
  });

  return {
    user: {
      ...user,
      role: dbUser?.role,
    },
    session: { ...session, memberRole: member?.role ?? null },
  };
}, options);

export const auth = betterAuth({
  basePath: "/api/v1/auth",
  baseURL: "http://localhost:5173",
  plugins: [
    ...(options.plugins ?? []),
    ...(stripePlugin.plugins ?? []),
    phoneNumber(),
    openAPI(),
    sessionMiddleware,
  ],
  database: prismaAdapter(basePrisma, {
    provider: "postgresql",
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: false,
    },
    disableCSRFCheck: true,
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    password: {
      hash: (password: string) => bcrypt.hash(password, 10),
      verify: ({ password, hash }) => bcrypt.compare(password, hash),
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") {
        return;
      }

      const role = ctx.body?.role as string;

      if (role && ["CLIENT", "ADMIN"].includes(role)) {
        ctx.body.role = role;
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role = user.role as string;

          if (role && !["CLIENT", "ADMIN"].includes(role)) {
            throw new APIError("BAD_REQUEST", { message: "Invalid role" });
          }

          return { data: user };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const membership = await basePrisma.members.findFirst({
            select: {
              organizationId: true,
            },
            where: {
              userId: session.userId,
            },
          });

          if (!membership) {
            return { data: session };
          }

          return {
            data: {
              ...session,
              activeOrganizationId: membership.organizationId,
            },
          };
        },
      },
    },
  },
});

export type AppSession = typeof sessionMiddleware.$Infer.Session;
