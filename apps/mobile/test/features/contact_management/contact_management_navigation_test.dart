import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/contact_management/presentation/pages/contact_management_page.dart';
import 'package:mobile/features/contact_management/repositories/contact_management_repository.dart';
import 'package:mobile/features/contact_management/repositories/mock_contact_management_repository.dart';
import 'package:mobile/features/settings/presentation/pages/settings_page.dart';
import 'package:mobile/features/settings/repositories/mock_settings_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Settings open Contact Management — see the feature README (and
/// `settings`'s README).
///
/// `ContactManagementPage` is reached here via internal navigation
/// (not constructed directly by the test), so it always resolves its
/// repository from the service locator — hence registering a mock
/// here. `SettingsPage` is constructed directly, so it gets its own
/// mock repository via constructor injection instead.
void main() {
  setUp(
    () => locator.registerSingleton<ContactManagementRepository>(
      MockContactManagementRepository(),
    ),
  );
  tearDown(() => locator.reset());

  testWidgets('tapping "Contactos" in Settings opens Contact Management', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: Scaffold(body: SettingsPage(repository: MockSettingsRepository())),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Contactos'));
    await tester.pumpAndSettle();

    expect(find.byType(ContactManagementPage), findsOneWidget);
    expect(find.text('Mis contactos'), findsWidgets);
  });
}
