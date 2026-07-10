import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/provider_dashboard/presentation/pages/provider_dashboard_page.dart';
import 'package:mobile/features/provider_services/presentation/pages/provider_services_page.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Provider Dashboard open Provider Services — see the feature README.
void main() {
  testWidgets(
    'tapping "Ver servicios" in Provider Dashboard opens Provider Services',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(body: ProviderDashboardPage()),
        ),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Ver servicios'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Ver servicios'));
      await tester.pumpAndSettle();

      expect(find.byType(ProviderServicesPage), findsOneWidget);
      expect(find.text('Mis servicios'), findsWidgets);
    },
  );
}
