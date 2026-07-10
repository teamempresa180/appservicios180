import '../../../order/entities/order.dart';
import '../../../order/models/order_status.dart';
import '../../../payment/entities/payment.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../review/entities/review.dart';

/// Presentation-only composition of everything the Provider Dashboard
/// screen needs. Composes six real domain entities — [provider],
/// [profile], [orders], [quotes], [reviews], [payments] — plus fields
/// with no domain equivalent yet:
///
/// - [todayEarnings], [weeklyEarnings], [monthlyEarnings]: **fully
///   simulated** — `Payment.amount` exists per single payment, but no
///   domain module aggregates earnings by calendar period (today/week/
///   month); that aggregation logic doesn't exist yet.
/// - [averageResponseTime]: **fully simulated** — same reasoning
///   already documented for `mockProviderProfileResponseTime` in
///   `provider_profile`: no real-time/messaging metric exists to
///   compute this.
/// - [acceptanceRate]: **fully simulated** — no domain module tracks
///   how many Quotes/Orders a provider accepted vs. rejected over
///   time.
///
/// Three fields the prompt asked for already have a real domain source
/// and are exposed as **derived getters** instead of being fabricated
/// a second time, following the same judgment call already documented
/// for `ProviderProfileData.experienceYears`, `QuoteData.subtotal`,
/// `OrderDisplay.scheduledDate` and `AddressDisplay.label`:
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
    required this.todayEarnings,
    required this.weeklyEarnings,
    required this.monthlyEarnings,
    required this.averageResponseTime,
    required this.acceptanceRate,
  });

  final Provider provider;
  final Profile profile;
  final List<Order> orders;
  final List<Quote> quotes;
  final List<Review> reviews;
  final List<Payment> payments;

  /// Simulated — see the class doc.
  final num todayEarnings;

  /// Simulated — see the class doc.
  final num weeklyEarnings;

  /// Simulated — see the class doc.
  final num monthlyEarnings;

  /// Simulated — see the class doc.
  final String averageResponseTime;

  /// Simulated — see the class doc.
  final double acceptanceRate;

  String get providerName => profile.displayName;

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
}
