import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/order/journey/client_order_journey.dart';
import 'package:mobile/order/journey/order_journey_action.dart';
import 'package:mobile/order/journey/order_journey_stage.dart';
import 'package:mobile/order/models/order_id.dart';
import 'package:mobile/order/models/order_priority.dart';
import 'package:mobile/order/models/order_status.dart';
import 'package:mobile/category/models/category_id.dart';
import 'package:mobile/identity/models/identity_id.dart';
import 'package:mobile/provider/models/provider_id.dart';
import 'package:mobile/service/models/service_id.dart';
import 'package:mobile/quote/entities/quote.dart';
import 'package:mobile/quote/models/quote_id.dart';
import 'package:mobile/quote/models/quote_status.dart';
import 'package:mobile/quote/models/quote_type.dart';

void main() {
  final now = DateTime(2026, 1, 1);

  Order buildOrder({
    OrderStatus status = OrderStatus.pending,
    ProviderId? providerId,
    ServiceId? serviceId,
  }) {
    return Order(
      id: OrderId.create(),
      identityId: IdentityId.create(),
      categoryId: CategoryId.create(),
      providerId: providerId,
      serviceId: serviceId,
      title: 'Fix the sink',
      description: 'desc',
      scheduledDate: DateTime(2026, 2, 1, 15),
      status: status,
      priority: OrderPriority.medium,
      createdAt: now,
      updatedAt: now,
    );
  }

  Quote buildQuote() {
    return Quote(
      id: QuoteId.create(),
      orderId: OrderId.create(),
      providerId: ProviderId.create(),
      proposedPrice: 50,
      estimatedDuration: 60,
      notes: 'notes',
      status: QuoteStatus.pending,
      type: QuoteType.standard,
      createdAt: now,
      updatedAt: now,
    );
  }

  test('pending with no quotes: awaiting quotes, can cancel', () {
    final info = ClientOrderJourney.derive(
      order: buildOrder(),
      quotes: const [],
      hasReviewed: false,
    );

    expect(info.stage, OrderJourneyStage.awaitingQuotes);
    expect(info.cancelled, isFalse);
    expect(
      info.actions.map((a) => a.kind),
      contains(OrderJourneyActionKind.cancelOrder),
    );
  });

  test('pending with quotes: quotes received, can view and cancel', () {
    final info = ClientOrderJourney.derive(
      order: buildOrder(),
      quotes: [buildQuote(), buildQuote()],
      hasReviewed: false,
    );

    expect(info.stage, OrderJourneyStage.quotesReceived);
    expect(
      info.actions.map((a) => a.kind),
      containsAll([
        OrderJourneyActionKind.viewQuotes,
        OrderJourneyActionKind.cancelOrder,
      ]),
    );
  });

  test('accepted: scheduled, can open chat and cancel', () {
    final info = ClientOrderJourney.derive(
      order: buildOrder(
        status: OrderStatus.accepted,
        providerId: ProviderId.create(),
        serviceId: ServiceId.create(),
      ),
      quotes: const [],
      hasReviewed: false,
    );

    expect(info.stage, OrderJourneyStage.scheduled);
    expect(
      info.actions.map((a) => a.kind),
      containsAll([
        OrderJourneyActionKind.openChat,
        OrderJourneyActionKind.cancelOrder,
      ]),
    );
  });

  test('inProgress: no cancel action available', () {
    final info = ClientOrderJourney.derive(
      order: buildOrder(status: OrderStatus.inProgress),
      quotes: const [],
      hasReviewed: false,
    );

    expect(info.stage, OrderJourneyStage.inProgress);
    expect(info.actions.map((a) => a.kind), isNot(contains(OrderJourneyActionKind.cancelOrder)));
  });

  test('completed without review: awaiting rating, can rate', () {
    final info = ClientOrderJourney.derive(
      order: buildOrder(status: OrderStatus.completed),
      quotes: const [],
      hasReviewed: false,
    );

    expect(info.stage, OrderJourneyStage.awaitingRating);
    expect(
      info.actions.map((a) => a.kind),
      contains(OrderJourneyActionKind.rateProvider),
    );
  });

  test('completed with review: done, no actions', () {
    final info = ClientOrderJourney.derive(
      order: buildOrder(status: OrderStatus.completed),
      quotes: const [],
      hasReviewed: true,
    );

    expect(info.stage, OrderJourneyStage.done);
    expect(info.actions, isEmpty);
  });

  test('cancelled order: cancelled flag set, no actions', () {
    final info = ClientOrderJourney.derive(
      order: buildOrder(status: OrderStatus.cancelled),
      quotes: const [],
      hasReviewed: false,
    );

    expect(info.cancelled, isTrue);
    expect(info.actions, isEmpty);
  });

  test('rejected order: cancelled flag set, no actions', () {
    final info = ClientOrderJourney.derive(
      order: buildOrder(status: OrderStatus.rejected),
      quotes: const [],
      hasReviewed: false,
    );

    expect(info.cancelled, isTrue);
    expect(info.actions, isEmpty);
  });
}
