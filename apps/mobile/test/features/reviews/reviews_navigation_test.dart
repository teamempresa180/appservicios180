import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/orders/presentation/pages/orders_page.dart';
import 'package:mobile/features/orders/repositories/mock_orders_repository.dart';
import 'package:mobile/features/reviews/presentation/pages/reviews_page.dart';
import 'package:mobile/features/reviews/repositories/mock_reviews_repository.dart';
import 'package:mobile/features/reviews/repositories/reviews_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets Orders
/// open Reviews — see the feature README (the prompt explicitly named
/// "Calificar" as the button to wire, no ambiguity to document).
///
/// `ReviewsPage` is reached here via internal navigation (not
/// constructed directly by the test), so it always resolves its
/// repository from the service locator — hence registering a mock here.
void main() {
  setUp(
    () => locator.registerSingleton<ReviewsRepository>(MockReviewsRepository()),
  );
  tearDown(() => locator.reset());

  testWidgets('tapping "Calificar" in Orders opens Reviews', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: Scaffold(body: OrdersPage(repository: MockOrdersRepository())),
      ),
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.text('Calificar'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Calificar'));
    await tester.pumpAndSettle();

    expect(find.byType(ReviewsPage), findsOneWidget);
    expect(find.text('Reseñas'), findsWidgets);
  });
}
