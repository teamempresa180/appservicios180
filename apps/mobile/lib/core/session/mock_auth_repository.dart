import 'auth_repository.dart';
import 'auth_tokens.dart';

/// Offline stand-in for [AuthRepository] — accepts any credentials so the
/// UI can be exercised end-to-end without a running backend. Swapped in
/// via [ApiConfig.useMockBackend] in `service_locator.dart`.
class MockAuthRepository implements AuthRepository {
  @override
  Future<AuthTokens> login({
    required String documentNumber,
    required String password,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 400));
    return const AuthTokens(
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      role: 'CUSTOMER',
    );
  }

  @override
  Future<AuthTokens> refresh(String refreshToken) async {
    return const AuthTokens(
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      role: 'CUSTOMER',
    );
  }

  @override
  Future<void> logout(String refreshToken) async {}

  @override
  Future<CurrentUser> me() async {
    return const CurrentUser(id: 'mock-user-id', role: 'CUSTOMER');
  }
}
