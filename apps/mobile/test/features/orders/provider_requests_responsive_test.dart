import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/orders/presentation/pages/provider_requests_page.dart';
import 'package:mobile/features/orders/presentation/widgets/provider_requests_header.dart';
import 'package:mobile/features/orders/repositories/mock_orders_repository.dart';
import 'package:mobile/features/reviews/repositories/mock_reviews_repository.dart';

/// Same overflow sweep as `orders_responsive_test.dart`, for the
/// provider-facing screen instead — `ProviderRequestCard` carries its
/// own status badges, price, action row and an expandable
/// `OrderProgress` timeline, none of which was covered by any existing
/// responsive test.
void main() {
  const widths = [320.0, 360.0, 390.0, 412.0, 768.0, 1024.0, 1440.0];

  Future<void> setSurfaceSize(WidgetTester tester, double width) async {
    final size = Size(width, 1400);
    await tester.binding.setSurfaceSize(size);
    tester.view.physicalSize = size;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });
  }

  for (final width in widths) {
    testWidgets('ProviderRequests has no overflow at ${width}px', (
      tester,
    ) async {
      await setSurfaceSize(tester, width);
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: ProviderRequestsPage(
              repository: MockOrdersRepository(),
              reviewsRepository: MockReviewsRepository(),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull);
    });

    testWidgets(
      'ProviderRequests history tab has no overflow at ${width}px',
      (tester) async {
        await setSurfaceSize(tester, width);
        await tester.pumpWidget(
          MaterialApp(
            theme: AppTheme.light,
            home: Scaffold(
              body: ProviderRequestsPage(
                repository: MockOrdersRepository(),
                reviewsRepository: MockReviewsRepository(),
                initialTab: ProviderRequestsTab.history,
              ),
            ),
          ),
        );
        await tester.pumpAndSettle();

        expect(tester.takeException(), isNull);
      },
    );
  }
}
