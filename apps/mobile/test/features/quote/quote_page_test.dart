import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/models/category_id.dart';
import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_button.dart';
import 'package:mobile/features/chat/repositories/chat_repository.dart';
import 'package:mobile/features/chat/repositories/mock_chat_repository.dart';
import 'package:mobile/features/quote/mock/mock_quote_data.dart';
import 'package:mobile/features/quote/presentation/pages/quote_page.dart';
import 'package:mobile/features/quote/presentation/widgets/quote_list_item.dart';
import 'package:mobile/features/quote/repositories/mock_quote_repository.dart';
import 'package:mobile/features/quote/repositories/quote_repository.dart';
import 'package:mobile/identity/models/identity_id.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/order/models/order_id.dart';
import 'package:mobile/order/models/order_priority.dart';
import 'package:mobile/order/models/order_status.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/provider/models/provider_id.dart';
import 'package:mobile/quote/entities/quote.dart';
import 'package:mobile/quote/models/quote_type.dart';

/// Wraps a real `MockQuoteRepository` for reads but makes `acceptQuote`
/// always fail — used to verify `QuotePage` surfaces the failure
/// instead of crashing with an unhandled exception (see
/// `QuotePage._accept`).
class _FailingAcceptQuoteRepository implements QuoteRepository {
  final QuoteRepository _delegate = MockQuoteRepository();

  @override
  Future<List<Quote>> getQuotesForOrder(
    OrderId orderId, {
    CancelToken? cancelToken,
  }) => _delegate.getQuotesForOrder(orderId, cancelToken: cancelToken);

  @override
  Future<Provider> getProviderFor(Quote quote, {CancelToken? cancelToken}) =>
      _delegate.getProviderFor(quote, cancelToken: cancelToken);

  @override
  Future<Profile> getProfileFor(Quote quote, {CancelToken? cancelToken}) =>
      _delegate.getProfileFor(quote, cancelToken: cancelToken);

  @override
  Future<Quote> createQuote({
    required OrderId orderId,
    required ProviderId providerId,
    required num proposedPrice,
    required int estimatedDuration,
    required String notes,
    required QuoteType type,
  }) => _delegate.createQuote(
    orderId: orderId,
    providerId: providerId,
    proposedPrice: proposedPrice,
    estimatedDuration: estimatedDuration,
    notes: notes,
    type: type,
  );

  @override
  Future<Quote> acceptQuote(Quote quote) {
    throw const ServerHttpException(
      'No se pudo aceptar la cotización.',
      statusCode: 500,
    );
  }

  @override
  Future<Quote> rejectQuote(Quote quote) => _delegate.rejectQuote(quote);
}

void main() {
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

      // Confirmation dialog — accepting a quote is irreversible.
      await tester.tap(find.widgetWithText(AppButton, 'Aceptar').last);
      await tester.pumpAndSettle();

      expect(find.text('Cotización aceptada.'), findsOneWidget);
      expect(find.text('Conversación'), findsWidgets);
    },
  );

  testWidgets(
    'shows an error snackbar and re-enables the button when acceptQuote fails',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: QuotePage(
              order: order,
              repository: _FailingAcceptQuoteRepository(),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Aceptar cotización').first);
      await tester.pumpAndSettle();
      await tester.tap(find.text('Aceptar cotización').first);
      await tester.pumpAndSettle();

      // Confirmation dialog — accepting a quote is irreversible.
      await tester.tap(find.widgetWithText(AppButton, 'Aceptar').last);
      await tester.pumpAndSettle();

      expect(find.text('No se pudo aceptar la cotización.'), findsOneWidget);
      expect(find.text('Conversación'), findsNothing);
      final buttons = tester.widgetList<AppButton>(
        find.widgetWithText(AppButton, 'Aceptar cotización'),
      );
      expect(buttons.every((button) => !button.isLoading), isTrue);
    },
  );

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
