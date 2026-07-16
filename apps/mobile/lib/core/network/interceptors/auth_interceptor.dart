import 'package:dio/dio.dart';
import '../token_provider.dart';

/// Attaches the current access token (if any) as a `Bearer` header.
/// Requests that already set their own `Authorization` header (none do
/// today, but a future public-only client could) are left untouched.
class AuthInterceptor extends Interceptor {
  AuthInterceptor(this._tokenProvider);

  final TokenProvider _tokenProvider;

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) {
    final token = _tokenProvider.accessToken;
    if (token != null && !options.headers.containsKey('Authorization')) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }
}
