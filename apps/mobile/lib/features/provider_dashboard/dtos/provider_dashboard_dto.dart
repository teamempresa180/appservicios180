import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../review/entities/review.dart';

/// Plain data shape a future `ProviderDashboardRemoteDataSource`
/// would receive from a real API response for this screen — the same
/// fields [ProviderDashboardDisplay] composes, but without its
/// derived getters (e.g. `activeOrdersCount`, `averageRating`,
/// computed by `ProviderDashboardMapper`/the widgets). No
/// `fromJson`/`toJson` yet — only the structure, see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
class ProviderDashboardDto {
  const ProviderDashboardDto({
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
  final num todayEarnings;
  final num weeklyEarnings;
  final num monthlyEarnings;
  final String averageResponseTime;
  final double acceptanceRate;
}
