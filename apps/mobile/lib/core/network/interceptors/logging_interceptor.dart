import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

/// Logs method/path/status/duration for every request — `debugPrint`
/// only, so it's a no-op in release builds (same reasoning as the
/// backend's `LoggingInterceptor`: observability, not a security
/// boundary, never logs headers/body which may carry the access token
/// or passwords).
class LoggingInterceptor extends Interceptor {
  final Map<RequestOptions, DateTime> _startedAt = {};

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) {
    _startedAt[options] = DateTime.now();
    debugPrint('[HTTP] → ${options.method} ${options.path}');
    handler.next(options);
  }

  @override
  void onResponse(
    Response<dynamic> response,
    ResponseInterceptorHandler handler,
  ) {
    _log(response.requestOptions, response.statusCode);
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    _log(err.requestOptions, err.response?.statusCode);
    handler.next(err);
  }

  void _log(RequestOptions options, int? statusCode) {
    final startedAt = _startedAt.remove(options);
    final elapsedMs = startedAt == null
        ? null
        : DateTime.now().difference(startedAt).inMilliseconds;
    debugPrint(
      '[HTTP] ← ${options.method} ${options.path} $statusCode (${elapsedMs}ms)',
    );
  }
}
