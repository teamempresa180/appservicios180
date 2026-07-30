import 'package:dio/dio.dart';
import 'http_exceptions.dart';

/// Translates a [DioException] into the app's own [HttpException]
/// hierarchy — the only place that knows Dio's exception shape exists;
/// repositories catch [HttpException], never [DioException].
abstract final class ErrorMapper {
  static HttpException fromDioException(DioException exception) {
    if (exception.type == DioExceptionType.cancel) {
      return const CancelledHttpException();
    }
    if (exception.type == DioExceptionType.connectionTimeout ||
        exception.type == DioExceptionType.sendTimeout ||
        exception.type == DioExceptionType.receiveTimeout ||
        exception.type == DioExceptionType.connectionError) {
      return NetworkHttpException(
        exception.message ?? 'Could not reach the server',
      );
    }

    final response = exception.response;
    if (response == null) {
      // Anything else with no response at all — most commonly
      // `DioExceptionType.unknown` wrapping a raw `SocketException`
      // (DNS lookup failure, connection refused, airplane mode) that
      // didn't get bucketed into `connectionError` above by this Dio
      // version/platform. Never surfaced as a generic "request failed"
      // — a real phone on flaky WiFi/mobile data hits this constantly
      // during the pilot, and it must read as "no internet", not as a
      // server-side failure.
      return NetworkHttpException(
        exception.message ?? 'Could not reach the server',
      );
    }

    final body = response.data;
    final String message = _readErrorField(body, 'message') ?? exception.message ?? 'Request failed';
    final String? error = _readErrorField(body, 'error');
    final String? path = _readErrorField(body, 'path');
    final int statusCode = response.statusCode ?? 500;

    switch (statusCode) {
      case 400:
        return BadRequestHttpException(message, error: error, path: path);
      case 401:
        return UnauthorizedHttpException(message, error: error, path: path);
      case 403:
        return ForbiddenHttpException(message, error: error, path: path);
      case 404:
        return NotFoundHttpException(message, error: error, path: path);
      case 422:
        return UnprocessableEntityHttpException(
          message,
          error: error,
          path: path,
        );
      default:
        return ServerHttpException(
          message,
          statusCode: statusCode,
          error: error,
          path: path,
        );
    }
  }

  static String? _readErrorField(Object? body, String field) {
    if (body is Map<String, dynamic> && body[field] is String) {
      return body[field] as String;
    }
    return null;
  }
}
