import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/availability/presentation/pages/availability_page.dart';
import 'package:mobile/features/availability/repositories/availability_repository.dart';
import 'package:mobile/features/availability/repositories/mock_availability_repository.dart';
import 'package:mobile/features/provider_dashboard/presentation/pages/provider_dashboard_page.dart';
import 'package:mobile/features/provider_dashboard/repositories/mock_provider_dashboard_repository.dart';
import 'package:mobile/features/provider_dashboard/repositories/provider_dashboard_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Provider Dashboard open Availability — see the feature README.
///
/// Both `ProviderDashboardPage` (the entry point) and `AvailabilityPage`
/// (reached via internal navigation, not constructed directly by the
/// test) resolve their repositories from the service locator — hence
/// registering mocks for both here.
void main() {
  setUp(() {
    locator.registerSingleton<AvailabilityRepository>(
      MockAvailabilityRepository(),
    );
    locator.registerSingleton<ProviderDashboardRepository>(
      MockProviderDashboardRepository(),
    );
  });
  tearDown(() => locator.reset());

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
