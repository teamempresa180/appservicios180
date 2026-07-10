import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/contact_management/presentation/pages/contact_management_page.dart';
import 'package:mobile/features/settings/presentation/pages/settings_page.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Settings open Contact Management — see the feature README (and
/// `settings`'s README).
void main() {
  testWidgets('tapping "Contactos" in Settings opens Contact Management', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const Scaffold(body: SettingsPage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Contactos'));
    await tester.pumpAndSettle();

    expect(find.byType(ContactManagementPage), findsOneWidget);
    expect(find.text('Mis contactos'), findsWidgets);
  });
}
