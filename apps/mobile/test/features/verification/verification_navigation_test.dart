import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/provider_profile/presentation/pages/provider_profile_page.dart';
import 'package:mobile/features/verification/presentation/pages/verification_page.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Provider Profile open Verification — see the feature README.
void main() {
  testWidgets('tapping "Verificación" in Provider Profile opens Verification', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const Scaffold(body: ProviderProfilePage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.text('Verificación'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Verificación'));
    await tester.pumpAndSettle();

    expect(find.byType(VerificationPage), findsOneWidget);
    expect(find.text('Verificación de identidad'), findsWidgets);
  });
}
