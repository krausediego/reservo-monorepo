export class PaymentRequiredError extends Error {
  public readonly statusCode = 402;

  public readonly code;

  constructor(message: string, code?: number) {
    super("Payment Required");
    this.name = "PaymentRequiredError";
    this.message = message;
    this.code = code;
  }
}
