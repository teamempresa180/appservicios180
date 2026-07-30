import 'package:dio/dio.dart';

/// Retries a request a bounded number of times on connectivity/timeout
/// failures only (never on a real HTTP error response — a `404` retried
/// is still a `404`). Idempotent-by-convention: this applies to every
/// request today, which is safe for the read-heavy pilot modules; a
/// non-idempotent write endpoint that needs different behavior can opt
/// out via `extra['noRetry'] = true` on the request options.
///
/// Retries are replayed through [requestDio] — the same fully-configured
/// [Dio] instance this interceptor is itself attached to (see
/// `ApiClient`'s constructor, which passes itself in) — never a bare
/// `Dio()`. A brand-new bare instance has no interceptors attached, so a
/// retried request would silently skip `AuthInterceptor` (could resend
/// with a stale/missing bearer token), `LoggingInterceptor` (retries
/// become invisible in logs) and `RefreshInterceptor` (a `401` hit
/// during a retry would never trigger a token refresh) — exactly the
/// bug this class used to have.
class RetryInterceptor extends Interceptor {
  RetryInterceptor(
    this.requestDio, {
    this.maxRetries = 2,
    this.delay = const Duration(milliseconds: 300),
  });

  /// The fully-configured [Dio] client (auth + retry + refresh +
  /// logging interceptors attached) to replay retried requests
  /// through.
  final Dio requestDio;

  final int maxRetries;
  final Duration delay;

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final isRetryableFailure =
        err.type == DioExceptionType.connectionTimeout ||
        err.type == DioExceptionType.sendTimeout ||
        err.type == DioExceptionType.receiveTimeout ||
        err.type == DioExceptionType.connectionError;

    final optedOut = err.requestOptions.extra['noRetry'] == true;
    final attempt = (err.requestOptions.extra['retryAttempt'] as int?) ?? 0;

    if (!isRetryableFailure || optedOut || attempt >= maxRetries) {
      handler.next(err);
      return;
    }

    await Future<void>.delayed(delay * (attempt + 1));

    final options = err.requestOptions;
    options.extra['retryAttempt'] = attempt + 1;

    try {
      final response = await requestDio.fetch<dynamic>(options);
      handler.resolve(response);
    } on DioException catch (retryError) {
      handler.next(retryError);
    }
  }
}
