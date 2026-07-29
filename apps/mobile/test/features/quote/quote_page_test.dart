import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/models/category_id.dart';
import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/chat/repositories/chat_repository.dart';
import 'package:mobile/features/chat/repositories/mock_chat_repository.dart';
import 'package:mobile/features/quote/mock/mock_quote_data.dart';
import 'package:mobile/features/quote/presentation/pages/quote_page.dart';
import 'package:mobile/features/quote/presentation/widgets/quote_list_item.dart';
import 'package:mobile/features/quote/repositories/mock_quote_repository.dart';
import 'package:mobile/identity/models/identity_id.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/order/models/order_priority.dart';
import 'package:mobile/order/models/order_status.dart';

void main() {
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

  setUp(
    () => locator.registerSingleton<ChatRepository>(MockChatRepository()),
  );
  tearDown(() => locator.reset());

  Widget buildApp() {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: QuotePage(order: order, repository: MockQuoteRepository()),
      ),
    );
  }

  testWidgets('shows the order title as header', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Reparación de fuga de agua'), findsOneWidget);
  });

  testWidgets('shows one QuoteListItem per real submitted Quote', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(QuoteListItem), findsNWidgets(2));
    expect(find.text('Diana Restrepo'), findsOneWidget);
    expect(find.text('Carlos Gómez'), findsOneWidget);
  });

  testWidgets('shows the proposed price and estimated duration per quote', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('\$45.00'), findsOneWidget);
    expect(find.text('60 min'), findsOneWidget);
  });

  testWidgets(
    'tapping "Aceptar cotización" accepts the real Quote and opens a Chat',
    (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Aceptar cotización').first);
      await tester.pumpAndSettle();
      await tester.tap(find.text('Aceptar cotización').first);
      await tester.pumpAndSettle();

      expect(find.text('Cotización aceptada.'), findsOneWidget);
      expect(find.text('Conversación'), findsWidgets);
    },
  );

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
