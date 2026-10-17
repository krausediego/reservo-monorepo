/**
 * Erros HTTP de domínio. Podem ser lançados de qualquer camada (service,
 * macro, handler): o Elysia chama `toResponse()` e devolve o mesmo contrato
 * da API antiga (`{ message, code }`).
 */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: number,
  ) {
    super(message);
    this.name = new.target.name;
  }

  toResponse(): Response {
    return Response.json(
      { message: this.message, code: this.code },
      { status: this.status },
    );
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string, code?: number) {
    super(400, message, code);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string, code?: number) {
    super(401, message, code);
  }
}

export class PaymentRequiredError extends HttpError {
  constructor(message: string, code?: number) {
    super(402, message, code);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string, code?: number) {
    super(403, message, code);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string, code?: number) {
    super(404, message, code);
  }
}

export class NotAllowedError extends HttpError {
  constructor(message: string, code?: number) {
    super(405, message, code);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string, code?: number) {
    super(409, message, code);
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string, code?: number) {
    super(500, message, code);
  }
}
