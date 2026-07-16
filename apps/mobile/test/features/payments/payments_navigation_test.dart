import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/orders/presentation/pages/orders_page.dart';
import 'package:mobile/features/orders/repositories/mock_orders_repository.dart';
import 'package:mobile/features/payments/presentation/pages/payments_page.dart';
import 'package:mobile/features/payments/repositories/mock_payments_repository.dart';
import 'package:mobile/features/payments/repositories/payments_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets Orders
/// open Payments — see the feature README (and `orders`' README) for
/// why "Ver detalle" is the button that opens it.
///
/// `PaymentsPage` is reached here via internal navigation (not
/// constructed directly by the test), so it always resolves its
/// repository from the service locator — hence registering a mock here.
void main() {
  setUp(
    () => locator.registerSingleton<PaymentsRepository>(
      MockPaymentsRepository(),
    ),
  );
  tearDown(() => locator.reset());

  testWidgets('tapping "Ver detalle" in Orders opens Payments', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: Scaffold(body: OrdersPage(repository: MockOrdersRepository())),
      ),
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.text('Ver detalle'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Ver detalle'));
    await tester.pumpAndSettle();

    expect(find.byType(PaymentsPage), findsOneWidget);
    expect(find.text('Pago'), findsWidgets);
  });
}
