import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/provider_profile/presentation/pages/provider_profile_page.dart';
import 'package:mobile/features/provider_profile/repositories/mock_provider_profile_repository.dart';
import 'package:mobile/features/provider_profile/repositories/provider_profile_repository.dart';
import 'package:mobile/features/service_detail/presentation/pages/service_detail_page.dart';
import 'package:mobile/features/service_detail/presentation/widgets/provider_information.dart'
    as service_detail_provider_information;
import 'package:mobile/features/service_detail/repositories/mock_service_detail_repository.dart';
import 'package:mobile/features/service_detail/repositories/service_detail_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Service Detail open Provider Profile — see the feature README.
///
/// Both `ServiceDetailPage` and `ProviderProfilePage` are reached here
/// via internal navigation (not constructed directly by the test), so
/// they always resolve their repository from the service locator —
/// hence registering mocks for both here.
void main() {
  setUp(() {
    locator.registerSingleton<ProviderProfileRepository>(
      MockProviderProfileRepository(),
    );
    locator.registerSingleton<ServiceDetailRepository>(
      MockServiceDetailRepository(),
    );
  });
  tearDown(() => locator.reset());

  testWidgets(
    'tapping the provider card in Service Detail opens Provider Profile',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(body: ServiceDetailPage()),
        ),
      );
      await tester.pumpAndSettle();

      await tester.tap(
        find.byType(service_detail_provider_information.ProviderInformation),
      );
      await tester.pumpAndSettle();

      expect(find.byType(ProviderProfilePage), findsOneWidget);
      expect(find.text('Perfil del proveedor'), findsOneWidget);
    },
  );
}
