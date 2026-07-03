import { BetterAuthOptions } from "better-auth/types";
import Stripe from "stripe";

import { StripeEnv } from "@/infra/config";
import { basePrisma } from "@/infra/database";
import { stripe } from "@better-auth/stripe";

const stripeClient = new Stripe(StripeEnv.secretKey, {
  apiVersion: "2026-06-24.dahlia",
});

export const stripePlugin = {
  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret:
        "whsec_62fd696affd2f7e15f18350840677fcae5a39031903aee64fc4e3fb1d46e5956",
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
          const { status } = stripeSubscription;

          if (status === "paused") {
            await basePrisma.organizations.update({
              data: {
                accessState: "GRACE",
                gracePausedAt: new Date(),
              },
              where: {
                id: subscription.referenceId,
              },
            });
          }

          if (status === "active") {
            await basePrisma.organizations.update({
              data: {
                accessState: "ACTIVE",
                gracePausedAt: null,
              },
              where: {
                id: subscription.referenceId,
              },
            });
          }
        },
        authorizeReference: async ({ user, referenceId, action }) => {
          if (
            [
              "upgrade-subscription",
              "cancel-subscription",
              "restore-subscription",
            ].includes(action)
          ) {
            const member = await basePrisma.members.findFirst({
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
