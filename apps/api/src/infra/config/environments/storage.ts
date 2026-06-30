import * as env from "env-var";

const StorageEnv = {
  accountID: env.get("R2_ACCOUNT_ID").required(true).asString(),
  accessKeyID: env.get("R2_ACCESS_KEY_ID").required(true).asString(),
  secretAccessKey: env.get("R2_SECRET_ACCESS_KEY").required(true).asString(),
  bucketName: env.get("R2_BUCKET_NAME").required(true).asString(),
};

export { StorageEnv };
