import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/provider_dashboard/presentation/pages/provider_dashboard_page.dart';
import 'package:mobile/features/provider_dashboard/repositories/mock_provider_dashboard_repository.dart';
import 'package:mobile/features/provider_dashboard/repositories/provider_dashboard_repository.dart';
import 'package:mobile/features/schedule/presentation/pages/schedule_page.dart';
import 'package:mobile/features/schedule/repositories/mock_schedule_repository.dart';
import 'package:mobile/features/schedule/repositories/schedule_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Provider Dashboard open Schedule — see the feature README.
///
/// Both `ProviderDashboardPage` (constructed directly by this test)
/// and `SchedulePage` (reached via internal navigation) always resolve
/// their repository from the service locator — hence registering a
/// mock for each here.
void main() {
  setUp(() {
    locator.registerSingleton<ScheduleRepository>(MockScheduleRepository());
    locator.registerSingleton<ProviderDashboardRepository>(
      MockProviderDashboardRepository(),
    );
  });
  tearDown(() => locator.reset());

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
