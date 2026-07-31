import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/order/journey/order_journey_action.dart';
import 'package:mobile/order/journey/order_journey_stage.dart';
import 'package:mobile/order/journey/provider_order_journey.dart';
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
      addressId: null,
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

  test('pending with no quote submitted: can submit a quote', () {
    final info = ProviderOrderJourney.derive(
      order: buildOrder(),
      myQuote: null,
      hasReviewed: false,
    );

    expect(info.stage, OrderJourneyStage.requested);
    expect(
      info.actions.map((a) => a.kind),
      contains(OrderJourneyActionKind.submitQuote),
    );
  });

  test('pending with a quote already submitted: no submit action, waiting', () {
    final info = ProviderOrderJourney.derive(
      order: buildOrder(),
      myQuote: buildQuote(),
      hasReviewed: false,
    );

    expect(info.stage, OrderJourneyStage.quotesReceived);
    expect(info.actions, isEmpty);
  });

  test('accepted: scheduled, can start the service', () {
    final info = ProviderOrderJourney.derive(
      order: buildOrder(
        status: OrderStatus.accepted,
        providerId: ProviderId.create(),
        serviceId: ServiceId.create(),
      ),
      myQuote: buildQuote(),
      hasReviewed: false,
    );

    expect(info.stage, OrderJourneyStage.scheduled);
    expect(
      info.actions.map((a) => a.kind),
      contains(OrderJourneyActionKind.startService),
    );
  });

  test('inProgress: can complete the service', () {
    final info = ProviderOrderJourney.derive(
      order: buildOrder(status: OrderStatus.inProgress),
      myQuote: buildQuote(),
      hasReviewed: false,
    );

    expect(info.stage, OrderJourneyStage.inProgress);
    expect(
      info.actions.map((a) => a.kind),
      contains(OrderJourneyActionKind.completeService),
    );
  });

  test('completed without client review: awaiting rating, no actions', () {
    final info = ProviderOrderJourney.derive(
      order: buildOrder(status: OrderStatus.completed),
      myQuote: buildQuote(),
      hasReviewed: false,
    );

    expect(info.stage, OrderJourneyStage.awaitingRating);
    expect(info.actions, isEmpty);
  });

  test('completed with client review: done', () {
    final info = ProviderOrderJourney.derive(
      order: buildOrder(status: OrderStatus.completed),
      myQuote: buildQuote(),
      hasReviewed: true,
    );

    expect(info.stage, OrderJourneyStage.done);
    expect(info.actions, isEmpty);
  });

  test('cancelled order: cancelled flag set', () {
    final info = ProviderOrderJourney.derive(
      order: buildOrder(status: OrderStatus.cancelled),
      myQuote: null,
      hasReviewed: false,
    );

    expect(info.cancelled, isTrue);
  });
}
