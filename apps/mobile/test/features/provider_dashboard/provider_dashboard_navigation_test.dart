import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/session/auth_repository.dart';
import 'package:mobile/core/session/auth_tokens.dart';
import 'package:mobile/core/session/session_manager.dart';
import 'package:mobile/core/storage/secure_token_storage.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/profile/presentation/pages/profile_page.dart';
import 'package:mobile/features/profile/repositories/mock_profile_repository.dart';
import 'package:mobile/features/provider_dashboard/presentation/pages/provider_dashboard_page.dart';
import 'package:mobile/features/provider_dashboard/repositories/mock_provider_dashboard_repository.dart';
import 'package:mobile/features/provider_dashboard/repositories/provider_dashboard_repository.dart';

class _FakeSecureTokenStorage implements SecureTokenStorage {
  @override
  Future<void> save({
    required String accessToken,
    required String refreshToken,
  }) async {}

  @override
  Future<String?> readAccessToken() async => null;

  @override
  Future<String?> readRefreshToken() async => null;

  @override
  Future<void> clear() async {}
}

/// Always reports a `PROVIDER` role — `ProfilePage` only shows "Panel
/// del proveedor" for a `SessionManager.currentRole == 'PROVIDER'`
/// session (see `profile_page.dart`), so this test needs a real
/// provider session, not `MockAuthRepository`'s hardcoded `'CUSTOMER'`.
class _ProviderAuthRepository implements AuthRepository {
  @override
  Future<AuthTokens> login({
    required String documentNumber,
    required String password,
  }) async => const AuthTokens(
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    role: 'PROVIDER',
  );

  @override
  Future<AuthTokens> refresh(String refreshToken) async => const AuthTokens(
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    role: 'PROVIDER',
  );

  @override
  Future<void> logout(String refreshToken) async {}

  @override
  Future<CurrentUser> me() async =>
      const CurrentUser(id: 'test-provider-id', role: 'PROVIDER');
}

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Profile open Provider Dashboard — see the feature README.
///
/// `ProviderDashboardPage` is reached here via internal navigation
/// (not constructed directly by the test), so it always resolves its
/// repository from the service locator — hence registering a mock
/// here. `ProfilePage` is constructed directly, so it gets its own
/// mock repository/session manager via constructor injection instead.
void main() {
  setUp(
    () => locator.registerSingleton<ProviderDashboardRepository>(
      MockProviderDashboardRepository(),
    ),
  );
  tearDown(() => locator.reset());

  testWidgets(
    'tapping "Panel del proveedor" in Profile opens Provider Dashboard',
    (tester) async {
      final sessionManager = SessionManager(
        authRepository: _ProviderAuthRepository(),
        tokenStorage: _FakeSecureTokenStorage(),
      );
      await sessionManager.login(
        documentNumber: '0000000000',
        password: 'irrelevant',
      );
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: ProfilePage(
              repository: MockProfileRepository(),
              sessionManager: sessionManager,
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Panel del proveedor'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Panel del proveedor'));
      await tester.pumpAndSettle();

      expect(find.byType(ProviderDashboardPage), findsOneWidget);
      expect(find.text('Panel del proveedor'), findsWidgets);
    },
  );
}
