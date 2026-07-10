import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/address_management/presentation/pages/address_management_page.dart';
import 'package:mobile/features/settings/presentation/pages/settings_page.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Settings open Address Management — see the feature README (and
/// `settings`'s README).
void main() {
  testWidgets(
    'tapping "Direcciones" in Settings opens Address Management',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(body: SettingsPage()),
        ),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.text('Direcciones'));
      await tester.pumpAndSettle();

      expect(find.byType(AddressManagementPage), findsOneWidget);
      expect(find.text('Mis direcciones'), findsWidgets);
    },
  );
}
