import '../../../order/entities/order.dart';
import '../../../order/journey/client_order_journey.dart';
import '../../../order/journey/order_journey_info.dart';
import '../../../order/models/order_status.dart';
import '../../../quote/entities/quote.dart';
import '../../../review/entities/review.dart';
import '../../quote/repositories/quote_repository.dart';

/// Shared "fetch everything `ClientOrderJourney.derive` needs for one
/// `Order`" helper. Both the Orders list (`OrdersViewModel`) and Home's
/// "most important active order" card need the exact same derivation —
/// this is the one place that fetches [order]'s quotes (only when it
/// could actually matter: a still-`Pending` order, per
/// `ClientOrderJourney`'s own switch) and checks [reviews] for a match,
/// instead of duplicating that judgment call in two view models.
abstract final class OrderJourneyLoader {
  static Future<OrderJourneyInfo> load({
    required Order order,
    required QuoteRepository quoteRepository,
    required List<Review> reviews,
  }) async {
    final quotes = order.status == OrderStatus.pending
        ? await quoteRepository.getQuotesForOrder(order.id)
        : const <Quote>[];
    final hasReviewed = reviews.any((review) => review.orderId == order.id);
    return ClientOrderJourney.derive(
      order: order,
      quotes: quotes,
      hasReviewed: hasReviewed,
    );
  }
}
