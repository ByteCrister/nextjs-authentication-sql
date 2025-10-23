export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function jsonError(status: number, message: string, code?: string) {
  return Response.json({ error: { message, code } }, { status });
}
