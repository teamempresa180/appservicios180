import 'dart:async';
import 'package:dio/dio.dart';
import '../api_config.dart';
import '../token_provider.dart';

/// On a `401` response, tries exactly one refresh-token exchange and
/// retries the original request with the new access token. If a refresh
/// is already in flight when a second `401` arrives, the second request
/// awaits the same in-flight attempt instead of firing a duplicate
/// refresh call — a refresh token can only be used once (backend
/// rotation), so two concurrent refresh calls would strand one request.
///
/// Uses its own bare [Dio] instance (no interceptors) for the refresh
/// call itself — attaching this same interceptor to that call would
/// recurse forever on a second `401`.
class RefreshInterceptor extends Interceptor {
  RefreshInterceptor(this._tokenProvider, this._requestDio) {
    _refreshDio = Dio(
      BaseOptions(
        baseUrl: ApiConfig.baseUrl,
        connectTimeout: ApiConfig.connectTimeout,
        receiveTimeout: ApiConfig.receiveTimeout,
      ),
    );
  }

  final TokenProvider _tokenProvider;
  final Dio _requestDio;
  late final Dio _refreshDio;

  Future<bool>? _refreshInFlight;

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final isUnauthorized = err.response?.statusCode == 401;
    final isRefreshCallItself = err.requestOptions.path.contains(
      '/authentications/refresh',
    );
    if (!isUnauthorized || isRefreshCallItself) {
      handler.next(err);
      return;
    }

    final refreshed = await (_refreshInFlight ??= _refresh());
    if (!refreshed) {
      handler.next(err);
      return;
    }

    try {
      final retried = await _requestDio.fetch<dynamic>(err.requestOptions);
      handler.resolve(retried);
    } on DioException catch (retryError) {
      handler.next(retryError);
    }
  }

  Future<bool> _refresh() async {
    try {
      final refreshToken = _tokenProvider.refreshToken;
      if (refreshToken == null) {
        await _tokenProvider.onSessionExpired();
        return false;
      }

      final response = await _refreshDio.post<Map<String, dynamic>>(
        '/authentications/refresh',
        data: {'refreshToken': refreshToken},
      );
      final data = response.data!;
      await _tokenProvider.onTokensRefreshed(
        accessToken: data['accessToken'] as String,
        refreshToken: data['refreshToken'] as String,
      );
      return true;
    } on DioException {
      await _tokenProvider.onSessionExpired();
      return false;
    } finally {
      _refreshInFlight = null;
    }
  }
}
