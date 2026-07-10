import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/profile/presentation/pages/profile_page.dart';
import 'package:mobile/features/provider_dashboard/presentation/pages/provider_dashboard_page.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Profile open Provider Dashboard — see the feature README.
void main() {
  testWidgets(
    'tapping "Panel del proveedor" in Profile opens Provider Dashboard',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(body: ProfilePage()),
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
