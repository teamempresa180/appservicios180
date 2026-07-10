import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/quote/presentation/pages/quote_page.dart';
import 'package:mobile/features/request_service/presentation/pages/request_service_page.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Request Service open Quote — see the feature README.
void main() {
  testWidgets(
    'tapping "Continuar" in Request Service opens Quote',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(body: RequestServicePage()),
        ),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Continuar'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Continuar'));
      await tester.pumpAndSettle();

      expect(find.byType(QuotePage), findsOneWidget);
      expect(find.text('Cotización'), findsWidgets);
    },
  );
}
