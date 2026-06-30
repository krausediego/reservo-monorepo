export class NotAllowedError extends Error {
  public readonly statusCode = 405;

  public readonly code;

  constructor(message: string, code?: number) {
    super("Not Allowed Error");
    this.name = "NotAllowedError";
    this.message = message;
    this.code = code;
  }
}
