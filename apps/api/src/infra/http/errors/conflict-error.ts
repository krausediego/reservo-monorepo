export class ConflictError extends Error {
  public readonly statusCode = 409;

  public readonly code;

  constructor(message: string, code?: number) {
    super("Conflict");
    this.name = "ConflictError";
    this.message = message;
    this.code = code;
  }
}
