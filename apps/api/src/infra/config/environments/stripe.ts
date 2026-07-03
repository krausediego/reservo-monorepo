import * as env from "env-var";

const StripeEnv = {
  secretKey: env.get("STRIPE_SECRET_KEY").required(true).asString(),
};

export { StripeEnv };
