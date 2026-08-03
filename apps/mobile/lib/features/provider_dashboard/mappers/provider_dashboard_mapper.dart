import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../review/entities/review.dart';
import '../models/provider_dashboard_display.dart';
import '../repositories/provider_dashboard_repository.dart';

/// Composes a [ProviderDashboardDisplay] purely from a
/// [ProviderDashboardRepository] — the conversion this feature's page
/// used to do inline in `_buildData()`. No simulated field is injected
/// anymore: every figure the dashboard shows is derived from the six
/// real entities below (see `ProviderDashboardDisplay`'s class doc).
/// Depends on the repository *contract*, not
/// `MockProviderDashboardRepository` (see `PROJECT_STATUS.md`, Sprint
/// 2, Etapa 6).
///
/// `Future`-returning since the repository's six methods became
/// `Future`-returning (real HTTP calls) — awaits all six via
/// [Future.wait] before composing the display model.
abstract final class ProviderDashboardMapper {
  static Future<ProviderDashboardDisplay> toDisplay({
    required ProviderDashboardRepository repository,
    DateTime? now,
  }) async {
    final results = await Future.wait([
      repository.getProvider(),
      repository.getProfile(),
      repository.getOrders(),
      repository.getQuotes(),
      repository.getReviews(),
      repository.getPayments(),
    ]);
    return ProviderDashboardDisplay(
      provider: results[0] as Provider,
      profile: results[1] as Profile,
      orders: results[2] as List<Order>,
      quotes: results[3] as List<Quote>,
      reviews: results[4] as List<Review>,
      payments: results[5] as List<Payment>,
      now: now,
    );
  }
}
