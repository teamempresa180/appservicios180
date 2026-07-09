import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/provider_profile/presentation/pages/provider_profile_page.dart';
import 'package:mobile/features/service_detail/presentation/pages/service_detail_page.dart';
import 'package:mobile/features/service_detail/presentation/widgets/provider_information.dart'
    as service_detail_provider_information;

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Service Detail open Provider Profile — see the feature README.
void main() {
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
