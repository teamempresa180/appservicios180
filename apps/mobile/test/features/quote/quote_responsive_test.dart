import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/models/category_id.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/quote/mock/mock_quote_data.dart';
import 'package:mobile/features/quote/presentation/pages/quote_page.dart';
import 'package:mobile/features/quote/repositories/mock_quote_repository.dart';
import 'package:mobile/identity/models/identity_id.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/order/models/order_priority.dart';
import 'package:mobile/order/models/order_status.dart';

void main() {
  const widths = [320.0, 360.0, 390.0, 412.0, 768.0, 1024.0, 1440.0];

  final order = Order(
    id: mockQuoteOrderId,
    identityId: IdentityId.create(),
    categoryId: CategoryId.create(),
    providerId: null,
    serviceId: null,
    addressId: null,
    title: 'Reparación de fuga de agua',
    description: 'Fuga debajo del lavaplatos',
    scheduledDate: DateTime(2026, 1, 10, 10, 0),
    status: OrderStatus.pending,
    priority: OrderPriority.medium,
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
  );

  Future<void> setSurfaceSize(WidgetTester tester, double width) async {
    final size = Size(width, 1200);
    await tester.binding.setSurfaceSize(size);
    tester.view.physicalSize = size;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });
  }

  for (final width in widths) {
    testWidgets('Quote has no overflow at ${width}px', (tester) async {
      await setSurfaceSize(tester, width);
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: QuotePage(order: order, repository: MockQuoteRepository()),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull);
    });
  }
}
