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

    // The failed request still carries the *old* `Authorization`
    // header, and `AuthInterceptor` only fills that header in when it
    // is absent — so replaying `err.requestOptions` as-is resent the
    // very token that just got rejected, guaranteeing a second 401 and
    // making the whole refresh-and-retry path a no-op. Stamping the
    // new token here (rather than deleting the header and leaning on
    // `AuthInterceptor`) also keeps the retry correct for a request
    // that legitimately set its own header.
    final refreshedToken = _tokenProvider.accessToken;
    final retryOptions = err.requestOptions;
    if (refreshedToken != null) {
      retryOptions.headers['Authorization'] = 'Bearer $refreshedToken';
    }

    try {
      final retried = await _requestDio.fetch<dynamic>(retryOptions);
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
        // The backend recomputes the role on every refresh, so this is
        // how an account approved as a Provider mid-session picks up
        // its new role without logging out and back in.
        role: data['role'] as String?,
      );
      return true;
    } on DioException {
      await _tokenProvider.onSessionExpired();
      return false;
    } catch (_) {
      // A malformed/unexpected refresh response (missing fields, wrong
      // shape) throws a `TypeError` here, not a `DioException`. Without
      // this branch it escaped `onError` uncaught, so the original
      // request never got resolved *or* rejected — its `await` simply
      // hung forever, freezing whatever screen was waiting on it. Treat
      // an unusable refresh response as a dead session.
      await _tokenProvider.onSessionExpired();
      return false;
    } finally {
      _refreshInFlight = null;
    }
  }
}
