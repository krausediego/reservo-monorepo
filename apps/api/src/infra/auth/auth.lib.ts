import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { organization, phoneNumber, openAPI } from "better-auth/plugins";

import { basePrisma } from "../database";

export const auth = betterAuth({
  basePath: "/api/v1/auth",
  // baseURL: "http://localhost:5173",
  plugins: [organization(), phoneNumber(), openAPI()],
  database: prismaAdapter(basePrisma, {
    provider: "postgresql",
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: false,
    },
    disableOriginCheck: true,
  },
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
  },
});
