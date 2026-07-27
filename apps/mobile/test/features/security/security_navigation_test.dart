import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/theme/theme_mode_controller.dart';
import 'package:mobile/core/theme/theme_mode_storage.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/security/presentation/pages/security_page.dart';
import 'package:mobile/features/security/repositories/mock_security_repository.dart';
import 'package:mobile/features/security/repositories/security_repository.dart';
import 'package:mobile/features/settings/presentation/pages/settings_page.dart';
import 'package:mobile/features/settings/repositories/mock_settings_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Settings open Security — see the feature README (and `settings`'s
/// README).
///
/// `SecurityPage` is reached here via internal navigation (not
/// constructed directly by the test), so it always resolves its
/// repository from the service locator — hence registering a mock here.
/// `SettingsPage` is constructed directly, so it gets its own mock
/// repository via constructor injection instead.
void main() {
  setUp(() {
    locator.registerSingleton<SecurityRepository>(MockSecurityRepository());
    locator.registerSingleton<ThemeModeController>(
      ThemeModeController(storage: ThemeModeStorage()),
    );
  });
  tearDown(() => locator.reset());

  testWidgets('tapping "Seguridad" in Settings opens Security', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: Scaffold(body: SettingsPage(repository: MockSettingsRepository())),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Seguridad'));
    await tester.pumpAndSettle();

    expect(find.byType(SecurityPage), findsOneWidget);
    expect(find.text('Seguridad'), findsWidgets);
  });
}
