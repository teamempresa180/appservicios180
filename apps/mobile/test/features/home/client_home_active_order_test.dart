import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/home/presentation/view_models/client_home_orders_view_model.dart';
import 'package:mobile/features/home/presentation/widgets/client_home_content.dart';
import 'package:mobile/features/home/presentation/widgets/home_active_order_card.dart';
import 'package:mobile/features/marketplace/repositories/mock_category_repository.dart';
import 'package:mobile/features/orders/repositories/mock_orders_repository.dart';
import 'package:mobile/features/quote/repositories/mock_quote_repository.dart';
import 'package:mobile/features/reviews/repositories/mock_reviews_repository.dart';
import 'package:mobile/order/entities/order.dart';

/// Confirms Cliente Home's "operations center" requirement: when the
/// client has at least one non-terminal order, it leads with the most
/// important one instead of just the categories prompt — see
/// `ClientHomeOrdersViewModel` for the derivation/priority order.
///
/// Uses the real `MockOrdersRepository`/`MockQuoteRepository`/
/// `MockReviewsRepository` fixtures (independent per feature, same as
/// every other cross-feature test in this codebase) — of its 4 mock
/// orders, 3 are non-terminal (pending/inProgress/completed-not-yet-
/// reviewed) and 1 is cancelled (excluded). The completed,
/// not-yet-reviewed order ranks highest (`awaitingRating` is tier 0 —
/// see the view model's priority doc), so it's the one Home surfaces.
void main() {
  Widget buildApp() {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: ClientHomeContent(
          ordersViewModel: ClientHomeOrdersViewModel(
            ordersRepository: MockOrdersRepository(),
            quoteRepository: MockQuoteRepository(),
            reviewsRepository: MockReviewsRepository(),
          ),
          categoryRepository: MockCategoryRepository(),
        ),
      ),
    );
  }

  testWidgets('shows the most important active order at the top of Home', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();
    // `HomeMapGreetingPill`'s `FadeIn` schedules a zero-duration delayed
    // `Future` — `pumpAndSettle` alone can leave it as a still-pending
    // `Timer` at teardown (same quirk documented in
    // `orders_page_test.dart`'s loading-state test); one more pump
    // flushes it deterministically.
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(HomeActiveOrderCard), findsOneWidget);
    expect(find.text('Tu servicio activo'), findsOneWidget);
    // The completed-but-not-yet-reviewed order outranks the pending and
    // inProgress ones (see the view model's priority doc).
    expect(find.text('Servicio finalizado'), findsOneWidget);
    expect(find.text('Calificar proveedor'), findsOneWidget);
  });

  testWidgets('shows a "Ver todas" link when more than one order is active', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();
    // `HomeMapGreetingPill`'s `FadeIn` schedules a zero-duration delayed
    // `Future` — `pumpAndSettle` alone can leave it as a still-pending
    // `Timer` at teardown (same quirk documented in
    // `orders_page_test.dart`'s loading-state test); one more pump
    // flushes it deterministically.
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.text('Ver todas'), findsOneWidget);
  });

  testWidgets(
    'falls back to categories when the client has no active orders',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: ClientHomeContent(
              ordersViewModel: ClientHomeOrdersViewModel(
                ordersRepository: _EmptyOrdersRepository(),
                quoteRepository: MockQuoteRepository(),
                reviewsRepository: MockReviewsRepository(),
              ),
              categoryRepository: MockCategoryRepository(),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
    // `HomeMapGreetingPill`'s `FadeIn` schedules a zero-duration delayed
    // `Future` — `pumpAndSettle` alone can leave it as a still-pending
    // `Timer` at teardown (same quirk documented in
    // `orders_page_test.dart`'s loading-state test); one more pump
    // flushes it deterministically.
    await tester.pump(const Duration(milliseconds: 300));

      expect(find.byType(HomeActiveOrderCard), findsNothing);
      expect(find.text('¿Qué servicio necesitas hoy?'), findsOneWidget);
    },
  );
}

/// A minimal `OrdersRepository` whose [getOrders] always returns an
/// empty list — used to exercise Home's "no active orders" fallback
/// deterministically, without depending on `MockOrdersRepository`'s
/// fixed fixtures ever changing.
class _EmptyOrdersRepository extends MockOrdersRepository {
  @override
  Future<List<Order>> getOrders({CancelToken? cancelToken}) =>
      Future.value(const []);
}
