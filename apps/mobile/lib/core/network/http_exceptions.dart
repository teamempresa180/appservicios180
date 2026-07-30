import '../exceptions/domain_exception.dart';

/// Base for every error the HTTP layer can throw. Mirrors the backend's
/// `ErrorResponseDto` shape (`statusCode`/`error`/`message`/`path`) so a
/// repository can react to the exact same classification the backend
/// already computed — no re-guessing which HTTP status means what.
abstract class HttpException extends DomainException {
  const HttpException(
    super.message, {
    this.statusCode,
    this.error,
    this.path,
  });

  /// The HTTP status code, when the failure reached the server
  /// (`null` for connectivity/timeout failures that never got a response).
  final int? statusCode;

  /// The backend's exception class name (e.g. `"NotFoundException"`),
  /// taken verbatim from `ErrorResponseDto.error`.
  final String? error;

  /// The request path the backend recorded the error against.
  final String? path;

  /// `true` for the "no internet / can't reach the server" family
  /// (timeout, DNS failure, no connectivity) — the case a "reconectando…"
  /// UI should react to, as opposed to a real response the server sent
  /// back (validation error, 401, 5xx). Only [NetworkHttpException]
  /// overrides this to `true`; every other subtype represents a
  /// response that *did* reach the client.
  bool get isConnectivityIssue => false;
}

/// 400 — malformed/invalid input (`ValidationException` on the backend).
class BadRequestHttpException extends HttpException {
  const BadRequestHttpException(super.message, {super.error, super.path})
    : super(statusCode: 400);
}

/// 401 — missing/invalid/expired credentials or token.
class UnauthorizedHttpException extends HttpException {
  const UnauthorizedHttpException(super.message, {super.error, super.path})
    : super(statusCode: 401);
}

/// 403 — authenticated but not permitted (role mismatch).
class ForbiddenHttpException extends HttpException {
  const ForbiddenHttpException(super.message, {super.error, super.path})
    : super(statusCode: 403);
}

/// 404 — no matching record.
class NotFoundHttpException extends HttpException {
  const NotFoundHttpException(super.message, {super.error, super.path})
    : super(statusCode: 404);
}

/// 422 — structurally valid but violates a domain invariant
/// (`BusinessRuleException` on the backend).
class UnprocessableEntityHttpException extends HttpException {
  const UnprocessableEntityHttpException(
    super.message, {
    super.error,
    super.path,
  }) : super(statusCode: 422);
}

/// Any other 4xx/5xx not covered above.
class ServerHttpException extends HttpException {
  const ServerHttpException(
    super.message, {
    required int super.statusCode,
    super.error,
    super.path,
  });
}

/// The request never reached the server or never got a response in time
/// (no connectivity, DNS failure, connect/receive/send timeout). This is
/// the "reconectando…" case — genuinely expected on a pilot running over
/// real WiFi/mobile data — as opposed to any other [HttpException]
/// subtype, which means a response *did* come back (even an error one).
class NetworkHttpException extends HttpException {
  const NetworkHttpException(super.message) : super(statusCode: null);

  @override
  bool get isConnectivityIssue => true;
}

/// The request was cancelled via its `CancelToken` (e.g. the caller
/// navigated away before the response arrived) — not a real failure,
/// callers typically swallow this rather than showing an error state.
class CancelledHttpException extends HttpException {
  const CancelledHttpException()
    : super('Request was cancelled', statusCode: null);
}
