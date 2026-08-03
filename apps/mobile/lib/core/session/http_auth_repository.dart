import '../network/api_client.dart';
import 'auth_repository.dart';
import 'auth_tokens.dart';

/// [AuthRepository] backed by [ApiClient] — the only implementation.
class HttpAuthRepository implements AuthRepository {
  HttpAuthRepository(this._apiClient);

  final ApiClient _apiClient;

  @override
  Future<AuthTokens> login({
    required String documentNumber,
    required String password,
  }) async {
    final json = await _apiClient.post(
      '/authentications/login',
      data: {'documentNumber': documentNumber, 'password': password},
    );
    return AuthTokens.fromJson(json);
  }

  @override
  Future<AuthTokens> refresh(String refreshToken) async {
    final json = await _apiClient.post(
      '/authentications/refresh',
      data: {'refreshToken': refreshToken},
    );
    return AuthTokens.fromJson(json);
  }

  /// Uses [ApiClient.postVoid], not `post` — this endpoint returns an
  /// empty body, which `post`'s `Map<String, dynamic>` cast can't
  /// handle. See `ApiClient.postVoid`.
  @override
  Future<void> logout(String refreshToken) => _apiClient.postVoid(
    '/authentications/logout',
    data: {'refreshToken': refreshToken},
  );

  @override
  Future<CurrentUser> me() async {
    final json = await _apiClient.get('/authentications/me');
    return CurrentUser.fromJson(json);
  }
}
