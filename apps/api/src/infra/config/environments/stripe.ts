import * as env from "env-var";

const StripeEnv = {
  secretKey: env.get("STRIPE_SECRET_KEY").required(true).asString(),
  webhookSecret: env.get("STRIPE_WEBHOOK_SECRET").required(true).asString(),
};

export { StripeEnv };
