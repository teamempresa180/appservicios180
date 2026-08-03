import '../../../order/entities/order.dart';
import '../../../order/models/order_status.dart';
import '../../../payment/entities/payment.dart';
import '../../../payment/models/payment_status.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../quote/models/quote_status.dart';
import '../../../review/entities/review.dart';

/// Presentation-only composition of everything the Provider Dashboard
/// screen needs. Composes six real domain entities — [provider],
/// [profile], [orders], [quotes], [reviews], [payments].
///
/// **Every number this model exposes is derived from those real
/// entities — nothing here is simulated.** Earnings
/// ([todayEarnings]/[weeklyEarnings]/[monthlyEarnings]) aggregate the
/// provider's own `Payment.amount` by calendar period, and
/// [acceptanceRate] counts real accepted vs. rejected [quotes]
/// (`null`, so the UI hides the row, until at least one quote has
/// actually been decided). The previously simulated
/// `averageResponseTime` was removed outright: no domain module
/// records message/quote response latency, so there was no honest way
/// to show it, and a fabricated "Responde en menos de 1 hora" on a
/// commercial dashboard is a credibility problem, not a placeholder.
///
/// The remaining figures follow the same judgment call already
/// documented for `ProviderProfileData.experienceYears`,
/// `QuoteData.subtotal`, `OrderDisplay.scheduledDate` and
/// `AddressDisplay.label`:
///
/// - [activeOrdersCount]/[completedOrdersCount]: **derived**, not
///   simulated — counted directly from the real [orders] by
///   `Order.status`.
/// - [pendingOrders]/[pendingRequestsCount]: **derived**, not
///   simulated — filtered directly from the real [orders]
///   (`OrderStatus.pending`).
/// - [averageRating]: **derived**, not simulated — computed from the
///   real [reviews], same approach as
///   `ProviderProfileData.rating`/`ServiceDetailData.rating`.
///
/// Nothing here is added to the domain entities themselves. No `Color`
/// or `IconData` is stored anywhere in this model — every widget
/// resolves both purely from `context.colors.*`/`Icons.*` at build
/// time.
class ProviderDashboardDisplay {
  const ProviderDashboardDisplay({
    required this.provider,
    required this.profile,
    required this.orders,
    required this.quotes,
    required this.reviews,
    required this.payments,
    DateTime? now,
  }) : _now = now;

  /// Reference "current time" for the calendar-period earnings
  /// getters. Injectable so tests are deterministic; production call
  /// sites leave it null and get `DateTime.now()`.
  final DateTime? _now;

  final Provider provider;
  final Profile profile;
  final List<Order> orders;
  final List<Quote> quotes;
  final List<Review> reviews;
  final List<Payment> payments;

  String get providerName => profile.displayName;

  /// Money this provider actually received: only `Completed` payments
  /// addressed to them. `Pending`/`Failed`/`Cancelled` payments are
  /// deliberately excluded — showing them as earnings would inflate
  /// the figure with money that never arrived.
  Iterable<Payment> get _earnedPayments => payments.where(
    (payment) =>
        payment.status == PaymentStatus.completed &&
        payment.receiverProviderId == provider.id,
  );

  num _earningsSince(DateTime start) => _earnedPayments
      .where((payment) => !payment.createdAt.isBefore(start))
      .fold<num>(0, (total, payment) => total + payment.amount);

  DateTime get _today {
    final now = _now ?? DateTime.now();
    return DateTime(now.year, now.month, now.day);
  }

  /// Derived from the real [payments] — see the class doc.
  num get todayEarnings => _earningsSince(_today);

  /// Derived from the real [payments] — see the class doc. Week starts
  /// on Monday, matching how the rest of the app labels weekdays.
  num get weeklyEarnings {
    final today = _today;
    return _earningsSince(today.subtract(Duration(days: today.weekday - 1)));
  }

  /// Derived from the real [payments] — see the class doc.
  num get monthlyEarnings {
    final today = _today;
    return _earningsSince(DateTime(today.year, today.month));
  }

  /// Share of this provider's quotes the client actually accepted, out
  /// of the ones that were decided either way. `null` while no quote
  /// has been accepted or rejected yet — the UI hides the row rather
  /// than showing a meaningless "0%" (or, worse, a made-up number) to
  /// a provider who simply hasn't been quoted on yet.
  double? get acceptanceRate {
    final decided = quotes.where(
      (quote) =>
          quote.status == QuoteStatus.accepted ||
          quote.status == QuoteStatus.rejected,
    );
    if (decided.isEmpty) return null;
    final accepted = decided
        .where((quote) => quote.status == QuoteStatus.accepted)
        .length;
    return accepted / decided.length;
  }

  /// Derived from the real [orders] — see the class doc.
  int get activeOrdersCount => orders
      .where(
        (order) =>
            order.status == OrderStatus.accepted ||
            order.status == OrderStatus.inProgress,
      )
      .length;

  /// Derived from the real [orders] — see the class doc.
  int get completedOrdersCount =>
      orders.where((order) => order.status == OrderStatus.completed).length;

  /// Derived from the real [orders] — see the class doc.
  List<Order> get pendingOrders =>
      orders.where((order) => order.status == OrderStatus.pending).toList();

  /// Derived from [pendingOrders] — see the class doc.
  int get pendingRequestsCount => pendingOrders.length;

  /// Derived from the real [reviews] — see the class doc.
  double get averageRating {
    if (reviews.isEmpty) return 0;
    final sum = reviews
        .map((review) => review.rating.value)
        .reduce((a, b) => a + b);
    return sum / reviews.length;
  }

  /// This provider's own `Quote` for [order], if any — same lookup
  /// `ProviderRequestDisplay`/`ProviderOrderJourney` need, but done
  /// against the already-loaded [quotes] list instead of a fresh
  /// repository call, since the dashboard loads every quote up front.
  Quote? myQuoteFor(Order order) {
    for (final quote in quotes) {
      if (quote.orderId == order.id) return quote;
    }
    return null;
  }

  /// Whether the client already rated [order] — same client-side
  /// filter used everywhere reviews are matched to an order (see
  /// `ProviderRequestsViewModel`).
  bool hasReviewFor(Order order) =>
      reviews.any((review) => review.orderId == order.id);

  /// Every order this provider is directly hired on and is actively
  /// working right now — `Accepted` (scheduled, not started) or
  /// `InProgress` — the pool [activeOrder] picks the single most
  /// urgent one from.
  List<Order> get activeOrders => orders
      .where(
        (order) =>
            order.status == OrderStatus.accepted ||
            order.status == OrderStatus.inProgress,
      )
      .toList();

  /// The single most urgent order to show front-and-center on the
  /// dashboard ("what do I do right now"): an `InProgress` order
  /// outranks every `Accepted` one (it's already underway), and among
  /// `Accepted` orders the soonest [Order.scheduledDate] wins. `null`
  /// when there's nothing currently active.
  Order? get activeOrder {
    final candidates = activeOrders;
    if (candidates.isEmpty) return null;

    Order best = candidates.first;
    for (final candidate in candidates.skip(1)) {
      final candidateIsInProgress =
          candidate.status == OrderStatus.inProgress;
      final bestIsInProgress = best.status == OrderStatus.inProgress;
      if (candidateIsInProgress && !bestIsInProgress) {
        best = candidate;
        continue;
      }
      if (bestIsInProgress && !candidateIsInProgress) continue;
      if (candidate.scheduledDate.isBefore(best.scheduledDate)) {
        best = candidate;
      }
    }
    return best;
  }

  /// Every other currently-active order besides [activeOrder] — backs
  /// the "Servicios programados" section (and the "ver los N
  /// restantes" link on the active-service card).
  List<Order> get otherActiveOrders {
    final current = activeOrder;
    if (current == null) return const [];
    return activeOrders.where((order) => order.id != current.id).toList();
  }

  /// Still-`Pending` orders this provider hasn't quoted yet — new work
  /// available to bid on (open requests in their category, or a fresh
  /// direct hire), distinct from [pendingQuoteOrders] below.
  List<Order> get newRequestOrders =>
      pendingOrders.where((order) => myQuoteFor(order) == null).toList();

  /// Still-`Pending` orders this provider already quoted — informational
  /// only, waiting on the client's decision.
  List<Order> get pendingQuoteOrders =>
      pendingOrders.where((order) => myQuoteFor(order) != null).toList();

  /// Everything with nothing left to do — `Completed`, `Cancelled` or
  /// `Rejected` — backs the least-prominent "historial" link.
  List<Order> get historyOrders => orders
      .where(
        (order) =>
            order.status == OrderStatus.completed ||
            order.status == OrderStatus.cancelled ||
            order.status == OrderStatus.rejected,
      )
      .toList();
}
