import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/payments/presentation/pages/payments_page.dart';
import 'package:mobile/features/payments/repositories/mock_payments_repository.dart';
import 'package:mobile/features/payments/repositories/payments_repository.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/order/models/order_id.dart';
import 'package:mobile/order/models/order_priority.dart';
import 'package:mobile/order/models/order_status.dart';
import 'package:mobile/category/models/category_id.dart';
import 'package:mobile/identity/models/identity_id.dart';

/// `PaymentsPage` used to be reachable from the client's Orders list via
/// a status-fixed "Ver detalle" button. The guided-journey pass (see
/// `order/journey/client_order_journey.dart`) replaced every client
/// order card's action buttons with exactly what `ClientOrderJourney`
/// derives for that order's real state — `viewQuotes`/`cancelOrder`/
/// `openChat`/`rateProvider` — none of which is "open Payments" (no
/// real payment gateway is modeled yet, explicitly out of scope for
/// that pass), so that button no longer exists on the client side.
///
/// `PaymentsPage` itself is untouched and still fully reachable when
/// constructed directly (e.g. by a future payment entry point) — this
/// smoke test just confirms it still renders correctly on its own,
/// since the previous "reached via Orders" wiring it asserted no
/// longer applies.
void main() {
  setUp(
    () => locator.registerSingleton<PaymentsRepository>(
      MockPaymentsRepository(),
    ),
  );
  tearDown(() => locator.reset());

  final order = Order(
    id: OrderId.fromString('payments-smoke-order'),
    identityId: IdentityId.create(),
    categoryId: CategoryId.create(),
    providerId: null,
    serviceId: null,
    addressId: null,
    title: 'Reparación de fuga de agua',
    description: 'Fuga debajo del lavaplatos',
    scheduledDate: DateTime(2026, 1, 10, 10, 0),
    status: OrderStatus.accepted,
    priority: OrderPriority.medium,
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
  );

  testWidgets('PaymentsPage renders for a given order', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: Scaffold(body: PaymentsPage(order: order)),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byType(PaymentsPage), findsOneWidget);
  });
}
