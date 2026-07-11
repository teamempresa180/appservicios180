/**
 * Consistent shape every exception filter below responds with — the
 * single error format every future controller's error responses will
 * share, regardless of which filter caught the exception.
 */
export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
}

export function buildErrorResponse(
  statusCode: number,
  error: string,
  message: string,
  path: string,
): ErrorResponse {
  return {
    statusCode,
    error,
    message,
    timestamp: new Date().toISOString(),
    path,
  };
}
