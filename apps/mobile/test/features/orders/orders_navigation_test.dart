import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/orders/presentation/pages/orders_page.dart';
import 'package:mobile/features/quote/presentation/pages/quote_page.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets Quote
/// open Orders — see the feature README.
void main() {
  testWidgets(
    'tapping "Confirmar solicitud" in Quote opens Orders',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(body: QuotePage()),
        ),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Confirmar solicitud'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Confirmar solicitud'));
      await tester.pumpAndSettle();

      expect(find.byType(OrdersPage), findsOneWidget);
      expect(find.text('Mis órdenes'), findsWidgets);
    },
  );
}
