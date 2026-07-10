import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/provider_profile/presentation/pages/provider_profile_page.dart';
import 'package:mobile/features/request_service/presentation/pages/request_service_page.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Provider Profile open Request Service — see the feature README.
void main() {
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

      await tester.ensureVisible(find.text('Solicitar servicio'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Solicitar servicio'));
      await tester.pumpAndSettle();

      expect(find.byType(RequestServicePage), findsOneWidget);
      expect(find.text('Solicitar servicio'), findsWidgets);
    },
  );
}
