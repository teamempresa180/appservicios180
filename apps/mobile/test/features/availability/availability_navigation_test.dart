import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/availability/presentation/pages/availability_page.dart';
import 'package:mobile/features/provider_dashboard/presentation/pages/provider_dashboard_page.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Provider Dashboard open Availability — see the feature README.
void main() {
  testWidgets(
    'tapping "Disponibilidad" in Provider Dashboard opens Availability',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(body: ProviderDashboardPage()),
        ),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Disponibilidad'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Disponibilidad'));
      await tester.pumpAndSettle();

      expect(find.byType(AvailabilityPage), findsOneWidget);
      expect(find.text('Disponibilidad'), findsWidgets);
    },
  );
}
