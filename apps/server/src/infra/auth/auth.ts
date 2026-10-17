import bcrypt from "bcryptjs";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import {
  organization,
  phoneNumber,
  openAPI,
  customSession,
} from "better-auth/plugins";

import { env } from "@/infra/config/env";
import { prisma } from "@/infra/database/prisma";

import { stripePlugin } from "./stripe.plugin";

const options = {
  plugins: [organization()],
} satisfies BetterAuthOptions;

const sessionMiddleware = customSession(async ({ user, session }) => {
  const dbUser = await prisma.users.findUnique({
    select: { role: true },
    where: { id: user.id },
  });

  if (!session.activeOrganizationId) {
    return {
      user: { ...user, role: dbUser?.role },
      session: { ...session, memberRole: null },
    };
  }

  const member = await prisma.members.findFirst({
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
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: env.CORS_ORIGIN,
  plugins: [
    ...(options.plugins ?? []),
    ...(stripePlugin.plugins ?? []),
    phoneNumber(),
    openAPI(),
    sessionMiddleware,
  ],
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
  database: prismaAdapter(prisma, {
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
        return {
          ...ctx,
          body: {
            ...ctx.body,
            role,
          },
        };
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role = user.role as string;

          if (role && !["CLIENT", "ADMIN"].includes(role)) {
            throw new APIError("BAD_REQUEST", {
              message: "Permissão inválida",
            });
          }

          return {
            data: {
              ...user,
            },
          };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const membership = await prisma.members.findFirst({
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
