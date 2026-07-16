import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/provider_dashboard/presentation/pages/provider_dashboard_page.dart';
import 'package:mobile/features/provider_dashboard/repositories/mock_provider_dashboard_repository.dart';
import 'package:mobile/features/provider_dashboard/repositories/provider_dashboard_repository.dart';
import 'package:mobile/features/provider_services/presentation/pages/provider_services_page.dart';
import 'package:mobile/features/provider_services/repositories/mock_provider_services_repository.dart';
import 'package:mobile/features/provider_services/repositories/provider_services_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Provider Dashboard open Provider Services — see the feature README.
///
/// Both `ProviderDashboardPage` (the entry point) and
/// `ProviderServicesPage` (reached via internal navigation, not
/// constructed directly by the test) resolve their repositories from
/// the service locator — hence registering mocks for both here.
void main() {
  setUp(() {
    locator.registerSingleton<ProviderServicesRepository>(
      MockProviderServicesRepository(),
    );
    locator.registerSingleton<ProviderDashboardRepository>(
      MockProviderDashboardRepository(),
    );
  });
  tearDown(() => locator.reset());

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
