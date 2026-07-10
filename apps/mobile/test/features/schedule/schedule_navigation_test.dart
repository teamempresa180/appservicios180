import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/provider_dashboard/presentation/pages/provider_dashboard_page.dart';
import 'package:mobile/features/schedule/presentation/pages/schedule_page.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Provider Dashboard open Schedule — see the feature README.
void main() {
  testWidgets('tapping "Agenda" in Provider Dashboard opens Schedule', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const Scaffold(body: ProviderDashboardPage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.text('Agenda'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Agenda'));
    await tester.pumpAndSettle();

    expect(find.byType(SchedulePage), findsOneWidget);
    expect(find.text('Agenda'), findsWidgets);
  });
}
