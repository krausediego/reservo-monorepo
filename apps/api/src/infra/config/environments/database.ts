import * as env from "env-var";

const DatabaseEnv = {
  connectionString: env.get("DATABASE_URL").asString(),
};

export { DatabaseEnv };
