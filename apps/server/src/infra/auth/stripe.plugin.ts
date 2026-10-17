import { stripe } from "@better-auth/stripe";
import type { BetterAuthOptions } from "better-auth/types";
import Stripe from "stripe";

import { env } from "@/infra/config/env";
import { prisma } from "@/infra/database/prisma";

const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-06-24.dahlia",
});

function resolveAccessState(status: string) {
  if (status === "active" || status === "trialing") {
    return { accessState: "ACTIVE" as const, gracePausedAt: null };
  }
  if (status === "paused") {
    return { accessState: "GRACE" as const, gracePausedAt: new Date() };
  }
  return null; // outros status: não mexe
}

export const stripePlugin = {
  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
      createCustomerOnSignUp: false,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "standard",
            priceId: "price_1Su03uAU7tDzPSpagM66FXmC",
            freeTrial: {
              days: 15,
            },
            limits: {
              professionals: 3,
              services: 15,
              products: 30,
              members: 2,
              storageMb: 1024,
            },
          },
          {
            name: "premium",
            priceId: "price_1Su04DAU7tDzPSpaa7MQFEjR",
            freeTrial: {
              days: 15,
            },
            limits: {
              professionals: 10,
              services: 50,
              products: 150,
              members: 5,
              storageMb: 5120,
            },
          },
          {
            name: "pro",
            priceId: "price_1Su04UAU7tDzPSpaX8vbzC1U",
            freeTrial: {
              days: 15,
            },
            limits: {
              professionals: -1,
              services: -1,
              products: -1,
              members: -1,
              storageMb: 20480,
            },
          },
        ],
        getCheckoutSessionParams: async () => {
          return {
            params: {
              payment_method_collection: "if_required",
              subscription_data: {
                trial_settings: {
                  end_behavior: {
                    missing_payment_method: "pause",
                  },
                },
              },
            },
          };
        },
        onSubscriptionUpdate: async ({ subscription, stripeSubscription }) => {
          const resolved = resolveAccessState(stripeSubscription.status);
          if (!resolved) {
            return;
          }

          await prisma.organizations.update({
            data: resolved,
            where: { id: subscription.referenceId },
          });
        },
        onSubscriptionComplete: async ({
          subscription,
          stripeSubscription,
        }) => {
          const resolved = resolveAccessState(stripeSubscription.status);
          if (!resolved) {
            return;
          }

          await prisma.organizations.update({
            data: resolved,
            where: { id: subscription.referenceId },
          });
        },
        onSubscriptionCancel: async ({ subscription }) => {
          await prisma.organizations.update({
            data: {
              accessState: "CANCELED",
              gracePausedAt: new Date(),
            },
            where: {
              id: subscription.referenceId,
            },
          });
        },
        onSubscriptionDeleted: async ({ subscription }) => {
          await prisma.organizations.update({
            data: {
              accessState: "CANCELED",
              gracePausedAt: new Date(),
            },
            where: {
              id: subscription.referenceId,
            },
          });
        },
        authorizeReference: async ({ user, referenceId, action }) => {
          if (
            [
              "upgrade-subscription",
              "cancel-subscription",
              "restore-subscription",
            ].includes(action)
          ) {
            const member = await prisma.members.findFirst({
              where: {
                organizationId: referenceId,
                userId: user.id,
              },
            });

            return member?.role === "OWNER";
          }

          return true;
        },
      },
      organization: {
        enabled: true,
      },
    }),
  ],
} satisfies BetterAuthOptions;
