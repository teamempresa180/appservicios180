import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/address_management/presentation/pages/address_management_page.dart';
import 'package:mobile/features/address_management/repositories/address_management_repository.dart';
import 'package:mobile/features/address_management/repositories/mock_address_management_repository.dart';
import 'package:mobile/features/settings/presentation/pages/settings_page.dart';
import 'package:mobile/features/settings/repositories/mock_settings_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Settings open Address Management — see the feature README (and
/// `settings`'s README).
///
/// `AddressManagementPage` is reached here via internal navigation
/// (not constructed directly by the test), so it always resolves its
/// repository from the service locator — hence registering a mock
/// here. `SettingsPage` is constructed directly, so it gets its own
/// mock repository via constructor injection instead.
void main() {
  setUp(
    () => locator.registerSingleton<AddressManagementRepository>(
      MockAddressManagementRepository(),
    ),
  );
  tearDown(() => locator.reset());

  testWidgets('tapping "Direcciones" in Settings opens Address Management', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: Scaffold(body: SettingsPage(repository: MockSettingsRepository())),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Direcciones'));
    await tester.pumpAndSettle();

    expect(find.byType(AddressManagementPage), findsOneWidget);
    expect(find.text('Mis direcciones'), findsWidgets);
  });
}
