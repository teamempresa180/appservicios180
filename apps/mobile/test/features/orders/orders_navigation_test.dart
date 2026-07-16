import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/orders/presentation/pages/orders_page.dart';
import 'package:mobile/features/orders/repositories/mock_orders_repository.dart';
import 'package:mobile/features/orders/repositories/orders_repository.dart';
import 'package:mobile/features/quote/presentation/pages/quote_page.dart';
import 'package:mobile/features/quote/repositories/mock_quote_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets Quote
/// open Orders — see the feature README.
///
/// `OrdersPage` is reached here via internal navigation (not
/// constructed directly by the test), so it always resolves its
/// repository from the service locator — hence registering a mock here.
void main() {
  setUp(
    () => locator.registerSingleton<OrdersRepository>(MockOrdersRepository()),
  );
  tearDown(() => locator.reset());

  testWidgets('tapping "Confirmar solicitud" in Quote opens Orders', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: Scaffold(body: QuotePage(repository: MockQuoteRepository())),
      ),
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.text('Confirmar solicitud'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Confirmar solicitud'));
    await tester.pumpAndSettle();

    expect(find.byType(OrdersPage), findsOneWidget);
    expect(find.text('Mis órdenes'), findsWidgets);
  });
}
