import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/session/auth_repository.dart';
import 'package:mobile/core/session/auth_tokens.dart';
import 'package:mobile/core/session/session_manager.dart';
import 'package:mobile/core/storage/secure_token_storage.dart';
import 'package:mobile/core/theme/theme_mode_controller.dart';
import 'package:mobile/core/theme/theme_mode_storage.dart';
import 'package:mobile/main.dart';

/// In-memory stand-in for [SecureTokenStorage] — avoids touching the
/// real `flutter_secure_storage` platform channel in widget tests.
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

class _FakeAuthRepository implements AuthRepository {
  @override
  Future<AuthTokens> login({
    required String documentNumber,
    required String password,
  }) => throw UnimplementedError();

  @override
  Future<AuthTokens> refresh(String refreshToken) => throw UnimplementedError();

  @override
  Future<void> logout(String refreshToken) => throw UnimplementedError();

  @override
  Future<CurrentUser> me() => throw UnimplementedError();
}

void main() {
  setUp(() {
    locator.registerSingleton<SessionManager>(
      SessionManager(
        authRepository: _FakeAuthRepository(),
        tokenStorage: _FakeSecureTokenStorage(),
      ),
    );
    locator.registerSingleton<ThemeModeController>(
      ThemeModeController(storage: ThemeModeStorage()),
    );
  });

  tearDown(() => locator.reset());

  testWidgets('shows the Splash screen and then navigates to Onboarding', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const AppServiciosApp());

    expect(
      find.image(const AssetImage('assets/icon/app_icon_source.png')),
      findsOneWidget,
    );
    expect(find.text('Inicializando...'), findsOneWidget);

    // No stored tokens (see `_FakeSecureTokenStorage.readAccessToken`),
    // so `SessionManager.restore()` resolves as logged-out and Splash
    // navigates to Onboarding — same fallback as before this session's
    // Sprint 5 change (real session check replacing the old
    // unconditional timed navigation).
    await tester.pumpAndSettle();

    expect(find.text('Bienvenido'), findsOneWidget);
  });
}
