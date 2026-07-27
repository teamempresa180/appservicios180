import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/session/mock_auth_repository.dart';
import 'package:mobile/core/session/session_manager.dart';
import 'package:mobile/core/storage/secure_token_storage.dart';
import 'package:mobile/core/theme/theme_mode_controller.dart';
import 'package:mobile/core/theme/theme_mode_storage.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/profile/presentation/pages/profile_page.dart';
import 'package:mobile/features/profile/repositories/mock_profile_repository.dart';
import 'package:mobile/features/settings/presentation/pages/settings_page.dart';
import 'package:mobile/features/settings/repositories/mock_settings_repository.dart';
import 'package:mobile/features/settings/repositories/settings_repository.dart';

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

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Profile open Settings — see the feature README.
///
/// `SettingsPage` is reached here via internal navigation (not
/// constructed directly by the test), so it always resolves its
/// repository from the service locator — hence registering a mock
/// here. `ProfilePage` is constructed directly, so it gets its own
/// mock repository/session manager via constructor injection instead.
void main() {
  setUp(() {
    locator.registerSingleton<SettingsRepository>(MockSettingsRepository());
    locator.registerSingleton<ThemeModeController>(
      ThemeModeController(storage: ThemeModeStorage()),
    );
  });
  tearDown(() => locator.reset());

  testWidgets('tapping the gear icon in Profile opens Settings', (
    tester,
  ) async {
    final sessionManager = SessionManager(
      authRepository: MockAuthRepository(),
      tokenStorage: _FakeSecureTokenStorage(),
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

    await tester.tap(find.byIcon(Icons.settings_outlined));
    await tester.pumpAndSettle();

    expect(find.byType(SettingsPage), findsOneWidget);
    expect(find.text('Configuración'), findsWidgets);
  });
}
