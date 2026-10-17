import { Type as t, type TSchema } from "@sinclair/typebox";
import { Value, type ValueError } from "@sinclair/typebox/value";

const EnvSchema = t.Object({
  NODE_ENV: t.Union(
    [t.Literal("development"), t.Literal("production"), t.Literal("test")],
    { default: "development" },
  ),
  PORT: t.Integer({ minimum: 1, default: 3333 }),
  LOG_LEVEL: t.Union(
    [
      t.Literal("trace"),
      t.Literal("debug"),
      t.Literal("info"),
      t.Literal("warn"),
      t.Literal("error"),
      t.Literal("fatal"),
    ],
    { default: "debug" },
  ),

  DATABASE_URL: t.String({ minLength: 1 }),

  BETTER_AUTH_SECRET: t.String({ minLength: 32 }),
  BETTER_AUTH_URL: t.String({ minLength: 1 }),
  CORS_ORIGIN: t
    .Transform(t.String({ default: "http://localhost:5173" }))
    .Decode((value) => value.split(",").map((origin) => origin.trim()))
    .Encode((origins) => origins.join(",")),

  STRIPE_SECRET_KEY: t.String({ minLength: 1 }),
  STRIPE_WEBHOOK_SECRET: t.String({ minLength: 1 }),

  OTEL_SERVICE_NAME: t.String({ default: "reservo-server" }),
});

const describe = ({ path, message, schema }: ValueError) => {
  const options = (schema.anyOf as TSchema[] | undefined)?.map((s) => s.const);
  const detail = options ? `expected one of ${options.join(" | ")}` : message;
  return `  ${path.slice(1)}: ${detail}`;
};

/**
 * `Clean` remove as variáveis que não estão no schema, `Default` aplica os
 * padrões e `Convert` transforma strings em número/boolean quando o schema
 * pede. Depois validamos e aplicamos os `Transform` (`Decode`).
 */
const parseEnv = () => {
  const raw = Value.Convert(
    EnvSchema,
    Value.Default(EnvSchema, Value.Clean(EnvSchema, { ...Bun.env })),
  );

  if (!Value.Check(EnvSchema, raw)) {
    const issues = [...Value.Errors(EnvSchema, raw)].map(describe);
    // eslint-disable-next-line no-console
    console.error(`Invalid environment:\n${issues.join("\n")}`);
    process.exit(1);
  }

  return Value.Decode(EnvSchema, raw);
};

export const env = parseEnv();
