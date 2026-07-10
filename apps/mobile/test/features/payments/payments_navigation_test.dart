import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/orders/presentation/pages/orders_page.dart';
import 'package:mobile/features/payments/presentation/pages/payments_page.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets Orders
/// open Payments — see the feature README (and `orders`' README) for
/// why "Ver detalle" is the button that opens it.
void main() {
  testWidgets(
    'tapping "Ver detalle" in Orders opens Payments',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(body: OrdersPage()),
        ),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Ver detalle'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Ver detalle'));
      await tester.pumpAndSettle();

      expect(find.byType(PaymentsPage), findsOneWidget);
      expect(find.text('Pago'), findsWidgets);
    },
  );
}
