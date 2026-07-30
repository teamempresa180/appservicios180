import 'package:flutter/foundation.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../order/entities/order.dart';
import '../../../../order/journey/order_journey_info.dart';
import '../../../../order/journey/order_journey_stage.dart';
import '../../../orders/models/order_display.dart';
import '../../../orders/repositories/orders_repository.dart';
import '../../../orders/services/order_display_loader.dart';
import '../../../orders/services/order_journey_loader.dart';
import '../../../quote/repositories/quote_repository.dart';
import '../../../reviews/repositories/reviews_repository.dart';

/// Whether Cliente Home should show the "most important active order"
/// card, or fall back to its default categories/quick-actions content.
enum ClientHomeOrdersStatus {
  /// Still fetching — see [ClientHomeOrdersViewModel.load].
  loading,

  /// At least one non-terminal order was found — [ClientHomeOrdersViewModel.topOrder]
  /// and [ClientHomeOrdersViewModel.topJourney] are both non-null.
  active,

  /// Either the client genuinely has no active order, or the fetch
  /// itself failed. Deliberately the *same* state for both — see the
  /// class doc for why Home never shows a hard error screen here.
  empty,
}

/// Loads the client's own orders (`OrdersRepository.getOrders` — the
/// real `GET /orders/mine`) and picks the single most important
/// non-terminal one to surface prominently at the top of Cliente Home,
/// so the client always sees "what's next" without opening Orders.
///
/// "Non-terminal" = not `cancelled`/`rejected` (`journey.cancelled`) and
/// not a `completed` order the client already reviewed
/// (`journey.stage != done`) — see [OrderJourneyLoader]/
/// `ClientOrderJourney` for the derivation itself; this view model only
/// picks among the results.
///
/// **Priority order among active orders** (documented here since it's a
/// judgment call, not something `ClientOrderJourney` itself dictates):
/// 1. `quotesReceived`/`awaitingRating` — the client has a decision to
///    make *right now* (compare quotes, or rate a finished service).
/// 2. `inProgress`/`scheduled` — a service already under way or booked;
///    nothing for the client to do but stay informed.
/// 3. `awaitingQuotes` — purely waiting on someone else to respond;
///    least urgent for the client's attention.
///
/// Ties within a tier break by most-recently-updated first (a stale
/// pending request is less "current" than one just created).
///
/// A thrown exception during [load] (network failure, missing DI
/// registration, etc.) is treated identically to "no active orders" —
/// per the explicit requirement that Home must never look broken to a
/// client who simply has nothing active yet.
class ClientHomeOrdersViewModel extends ChangeNotifier {
  ClientHomeOrdersViewModel({
    OrdersRepository? ordersRepository,
    QuoteRepository? quoteRepository,
    ReviewsRepository? reviewsRepository,
  }) : _ordersRepositoryOverride = ordersRepository,
       _quoteRepositoryOverride = quoteRepository,
       _reviewsRepositoryOverride = reviewsRepository;

  final OrdersRepository? _ordersRepositoryOverride;
  final QuoteRepository? _quoteRepositoryOverride;
  final ReviewsRepository? _reviewsRepositoryOverride;

  ClientHomeOrdersStatus _status = ClientHomeOrdersStatus.loading;
  Order? _topOrder;
  OrderJourneyInfo? _topJourney;
  OrderDisplay? _topDisplay;
  int _activeCount = 0;

  ClientHomeOrdersStatus get status => _status;
  Order? get topOrder => _topOrder;
  OrderJourneyInfo? get topJourney => _topJourney;

  /// Full display composition (service/provider/category/quote) for
  /// [topOrder] — built via the same `OrderDisplayLoader` the Orders
  /// list itself uses, so the Home card's single primary button can
  /// reuse `OrderActions` unchanged instead of re-wiring each
  /// `OrderJourneyActionKind` a second time.
  OrderDisplay? get topDisplay => _topDisplay;

  /// How many non-terminal orders exist in total — used to decide
  /// whether to show a "ver todas" link alongside the top one.
  int get activeCount => _activeCount;
  bool get hasMultipleActive => _activeCount > 1;

  static int _priorityRank(OrderJourneyStage stage) {
    switch (stage) {
      case OrderJourneyStage.quotesReceived:
      case OrderJourneyStage.awaitingRating:
        return 0;
      case OrderJourneyStage.inProgress:
      case OrderJourneyStage.scheduled:
      case OrderJourneyStage.accepted:
      case OrderJourneyStage.onTheWay:
        return 1;
      case OrderJourneyStage.awaitingQuotes:
        return 2;
      case OrderJourneyStage.requested:
      case OrderJourneyStage.completed:
      case OrderJourneyStage.done:
        // `ClientOrderJourney` never actually derives these as the
        // *current* stage for a non-terminal order (`accepted` isn't
        // even a stage it produces at all — it maps `OrderStatus
        // .accepted` to `scheduled` instead) — kept only so this switch
        // stays exhaustive against the full, shared `OrderJourneyStage`
        // enum.
        return 3;
    }
  }

  Future<void> load() async {
    _status = ClientHomeOrdersStatus.loading;
    notifyListeners();
    try {
      final ordersRepository = _ordersRepositoryOverride ?? locator<OrdersRepository>();
      final quoteRepository = _quoteRepositoryOverride ?? locator<QuoteRepository>();
      final reviewsRepository =
          _reviewsRepositoryOverride ?? locator<ReviewsRepository>();

      final orders = await ordersRepository.getOrders();
      final reviews = await reviewsRepository.getReviews();

      final active = <(Order, OrderJourneyInfo)>[];
      for (final order in orders) {
        final journey = await OrderJourneyLoader.load(
          order: order,
          quoteRepository: quoteRepository,
          reviews: reviews,
        );
        if (!journey.cancelled && journey.stage != OrderJourneyStage.done) {
          active.add((order, journey));
        }
      }

      if (active.isEmpty) {
        _status = ClientHomeOrdersStatus.empty;
        _topOrder = null;
        _topJourney = null;
        _topDisplay = null;
        _activeCount = 0;
        notifyListeners();
        return;
      }

      active.sort((a, b) {
        final rankCompare = _priorityRank(
          a.$2.stage,
        ).compareTo(_priorityRank(b.$2.stage));
        if (rankCompare != 0) return rankCompare;
        return b.$1.updatedAt.compareTo(a.$1.updatedAt);
      });

      final top = active.first;
      _topOrder = top.$1;
      _topJourney = top.$2;
      _activeCount = active.length;
      _topDisplay = await OrderDisplayLoader.load(top.$1, ordersRepository);

      _status = ClientHomeOrdersStatus.active;
    } catch (_) {
      _status = ClientHomeOrdersStatus.empty;
      _topOrder = null;
      _topJourney = null;
      _topDisplay = null;
      _activeCount = 0;
    }
    notifyListeners();
  }

  Future<void> retry() => load();
}
