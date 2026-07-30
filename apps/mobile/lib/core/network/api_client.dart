import 'package:dio/dio.dart';
import 'api_config.dart';
import 'error_mapper.dart';
import 'http_exceptions.dart';
import 'interceptors/auth_interceptor.dart';
import 'interceptors/logging_interceptor.dart';
import 'interceptors/refresh_interceptor.dart';
import 'interceptors/retry_interceptor.dart';
import 'token_provider.dart';

/// Thin, reusable wrapper around [Dio] — the single place every
/// repository's HTTP data source depends on. Wires the four
/// interceptors in the order that makes them compose correctly:
/// auth (attach token) → retry (transient failures) → refresh (401 →
/// new token → retry once) → logging (observes everything, including
/// what the other three already resolved/rewrote).
class ApiClient {
  ApiClient(TokenProvider tokenProvider) : _dio = Dio(_baseOptions) {
    _dio.interceptors.addAll([
      AuthInterceptor(tokenProvider),
      // Retries replay through `_dio` itself (see `RetryInterceptor`'s
      // own doc comment) so a retried request still goes through auth,
      // refresh and logging — not a bare, interceptor-less `Dio()`.
      RetryInterceptor(_dio),
      RefreshInterceptor(tokenProvider, _dio),
      LoggingInterceptor(),
    ]);
  }

  final Dio _dio;

  static final BaseOptions _baseOptions = BaseOptions(
    baseUrl: ApiConfig.baseUrl,
    connectTimeout: ApiConfig.connectTimeout,
    receiveTimeout: ApiConfig.receiveTimeout,
    sendTimeout: ApiConfig.sendTimeout,
  );

  Future<Map<String, dynamic>> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    CancelToken? cancelToken,
  }) => _send(
    () => _dio.get<Map<String, dynamic>>(
      path,
      queryParameters: queryParameters,
      cancelToken: cancelToken,
    ),
  );

  /// For list endpoints — the backend returns `{ items, total, page,
  /// pageSize }` for paginated resources, but a bare JSON array for
  /// `search`. Callers that only ever hit one shape use [get]/[getList]
  /// directly; this exists for completeness.
  Future<List<dynamic>> getList(
    String path, {
    Map<String, dynamic>? queryParameters,
    CancelToken? cancelToken,
  }) => _send(
    () => _dio.get<List<dynamic>>(
      path,
      queryParameters: queryParameters,
      cancelToken: cancelToken,
    ),
  );

  Future<Map<String, dynamic>> post(
    String path, {
    Object? data,
    CancelToken? cancelToken,
    void Function(int sent, int total)? onSendProgress,
  }) => _send(
    () => _dio.post<Map<String, dynamic>>(
      path,
      data: data,
      cancelToken: cancelToken,
      onSendProgress: onSendProgress,
    ),
  );

  Future<Map<String, dynamic>> put(
    String path, {
    Object? data,
    CancelToken? cancelToken,
  }) => _send(
    () => _dio.put<Map<String, dynamic>>(
      path,
      data: data,
      cancelToken: cancelToken,
    ),
  );

  Future<void> delete(String path, {CancelToken? cancelToken}) async {
    try {
      await _dio.delete<void>(path, cancelToken: cancelToken);
    } on DioException catch (exception) {
      throw ErrorMapper.fromDioException(exception);
    }
  }

  Future<T> _send<T>(Future<Response<T>> Function() request) async {
    try {
      final response = await request();
      return response.data as T;
    } on DioException catch (exception) {
      throw ErrorMapper.fromDioException(exception);
    }
  }
}

/// Re-exported so repositories only need to import `api_client.dart` for
/// both the client and the exception type they should catch.
typedef ApiHttpException = HttpException;
