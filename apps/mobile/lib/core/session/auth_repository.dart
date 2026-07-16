import 'auth_tokens.dart';

/// Contract for the real authentication endpoints
/// (`POST /authentications/{login,refresh,logout}`, `GET /authentications/me`).
/// [SessionManager] is the only consumer — pages never call this directly.
abstract class AuthRepository {
  Future<AuthTokens> login({
    required String documentNumber,
    required String password,
  });

  Future<AuthTokens> refresh(String refreshToken);

  Future<void> logout(String refreshToken);

  Future<CurrentUser> me();
}
