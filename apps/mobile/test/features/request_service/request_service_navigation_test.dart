import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/provider_profile/presentation/pages/provider_profile_page.dart';
import 'package:mobile/features/provider_profile/repositories/mock_provider_profile_repository.dart';
import 'package:mobile/features/provider_profile/repositories/provider_profile_repository.dart';
import 'package:mobile/features/request_service/presentation/pages/request_service_page.dart';
import 'package:mobile/features/request_service/repositories/mock_request_service_repository.dart';
import 'package:mobile/features/request_service/repositories/request_service_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Provider Profile open Request Service — see the feature README.
///
/// Both pages are reached here without an explicit `repository`
/// override, so they resolve from the service locator — hence
/// registering mocks here.
void main() {
  setUp(() {
    locator.registerSingleton<ProviderProfileRepository>(
      MockProviderProfileRepository(),
    );
    locator.registerSingleton<RequestServiceRepository>(
      MockRequestServiceRepository(),
    );
  });
  tearDown(() => locator.reset());

  testWidgets(
    'tapping "Solicitar servicio" in Provider Profile opens Request Service',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(body: ProviderProfilePage()),
        ),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Solicitar servicio').first);
      await tester.pumpAndSettle();
      await tester.tap(find.text('Solicitar servicio').first);
      await tester.pumpAndSettle();

      // This provider offers more than one Service — a picker dialog
      // appears first (see `ProviderActions._pickServiceAndRequest`).
      expect(find.text('Elige un servicio'), findsOneWidget);
      await tester.tap(find.byType(ListTile).first);
      await tester.pumpAndSettle();

      expect(find.byType(RequestServicePage), findsOneWidget);
      expect(find.text('Solicitar servicio'), findsWidgets);
    },
  );
}
