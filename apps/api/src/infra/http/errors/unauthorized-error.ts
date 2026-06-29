export class UnauthorizedError extends Error {
  public readonly statusCode = 401;

  public readonly code;

  constructor(message: string, code?: number) {
    super("Unauthorized");
    this.name = "UnauthorizedError";
    this.message = message;
    this.code = code;
  }
}
