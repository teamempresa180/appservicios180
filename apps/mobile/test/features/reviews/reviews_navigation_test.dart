import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/orders/presentation/pages/orders_page.dart';
import 'package:mobile/features/orders/repositories/mock_orders_repository.dart';
import 'package:mobile/features/quote/repositories/mock_quote_repository.dart';
import 'package:mobile/features/reviews/presentation/pages/create_review_page.dart';
import 'package:mobile/features/reviews/repositories/mock_reviews_repository.dart';
import 'package:mobile/features/reviews/repositories/reviews_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets Orders
/// open a real rating form for a completed, not-yet-reviewed order —
/// see the feature README ("Calificar proveedor" opens
/// `CreateReviewPage`, scoped to the real order/provider that just
/// completed, instead of a read-only, zero-argument `ReviewsPage`).
/// The button label/action itself is derived by `ClientOrderJourney`
/// (see `order/journey/client_order_journey.dart`), not fixed per
/// `Order.status` anymore.
///
/// `CreateReviewPage` is reached here via internal navigation (not
/// constructed directly by the test), so it always resolves its own
/// repository from the service locator — hence registering a mock here
/// (the `reviewsRepository` passed to `OrdersPage` below is a separate
/// instance, only used for this order's journey derivation).
void main() {
  setUp(
    () => locator.registerSingleton<ReviewsRepository>(MockReviewsRepository()),
  );
  tearDown(() => locator.reset());

  testWidgets('tapping "Calificar proveedor" in Orders opens the rating form', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: Scaffold(
          body: OrdersPage(
            repository: MockOrdersRepository(),
            quoteRepository: MockQuoteRepository(),
            reviewsRepository: MockReviewsRepository(),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.text('Calificar proveedor'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Calificar proveedor'));
    await tester.pumpAndSettle();

    expect(find.byType(CreateReviewPage), findsOneWidget);
    expect(find.text('Califica tu experiencia'), findsOneWidget);
  });
}
