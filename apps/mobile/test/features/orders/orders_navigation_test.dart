import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/models/category_id.dart';
import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/chat/repositories/chat_repository.dart';
import 'package:mobile/features/chat/repositories/mock_chat_repository.dart';
import 'package:mobile/features/quote/mock/mock_quote_data.dart';
import 'package:mobile/features/quote/presentation/pages/quote_page.dart';
import 'package:mobile/features/quote/repositories/mock_quote_repository.dart';
import 'package:mobile/identity/models/identity_id.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/order/models/order_priority.dart';
import 'package:mobile/order/models/order_status.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// accepting a Quote open a real Chat conversation — see the feature
/// README.
///
/// `ChatPage` is reached here via internal navigation (not constructed
/// directly by the test), so it always resolves its repository from the
/// service locator — hence registering a mock here.
void main() {
  setUp(
    () => locator.registerSingleton<ChatRepository>(MockChatRepository()),
  );
  tearDown(() => locator.reset());

  final order = Order(
    id: mockQuoteOrderId,
    identityId: IdentityId.create(),
    categoryId: CategoryId.create(),
    providerId: null,
    serviceId: null,
    title: 'Reparación de fuga de agua',
    description: 'Fuga debajo del lavaplatos',
    scheduledDate: DateTime(2026, 1, 10, 10, 0),
    status: OrderStatus.pending,
    priority: OrderPriority.medium,
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
  );

  testWidgets('accepting a quote opens a real Chat conversation', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: Scaffold(
          body: QuotePage(order: order, repository: MockQuoteRepository()),
        ),
      ),
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.text('Aceptar cotización').first);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Aceptar cotización').first);
    await tester.pumpAndSettle();

    expect(find.text('Cotización aceptada.'), findsOneWidget);
    expect(find.text('Conversación'), findsWidgets);
  });
}
