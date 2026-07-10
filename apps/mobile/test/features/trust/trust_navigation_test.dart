import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/provider_profile/presentation/pages/provider_profile_page.dart';
import 'package:mobile/features/trust/presentation/pages/trust_page.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Provider Profile open Trust — see the feature README.
void main() {
  testWidgets('tapping "Confianza" in Provider Profile opens Trust', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const Scaffold(body: ProviderProfilePage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.text('Confianza'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Confianza'));
    await tester.pumpAndSettle();

    expect(find.byType(TrustPage), findsOneWidget);
    expect(find.text('Confianza y reputación'), findsWidgets);
  });
}
