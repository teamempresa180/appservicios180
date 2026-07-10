import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/security/presentation/pages/security_page.dart';
import 'package:mobile/features/settings/presentation/pages/settings_page.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Settings open Security — see the feature README (and `settings`'s
/// README).
void main() {
  testWidgets('tapping "Seguridad" in Settings opens Security', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const Scaffold(body: SettingsPage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Seguridad'));
    await tester.pumpAndSettle();

    expect(find.byType(SecurityPage), findsOneWidget);
    expect(find.text('Seguridad'), findsWidgets);
  });
}
