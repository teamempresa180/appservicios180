import '../models/provider_dashboard_display.dart';
import '../repositories/provider_dashboard_repository.dart';

/// Composes a [ProviderDashboardDisplay] from a
/// [ProviderDashboardRepository] plus the fields still simulated in
/// this feature (see `ProviderDashboardDisplay`'s class doc) — the
/// conversion this feature's page used to do inline in
/// `_buildData()`. Depends on the repository *contract*, not
/// `MockProviderDashboardRepository` (see `PROJECT_STATUS.md`, Sprint
/// 2, Etapa 6).
abstract final class ProviderDashboardMapper {
  static ProviderDashboardDisplay toDisplay({
    required ProviderDashboardRepository repository,
    required num todayEarnings,
    required num weeklyEarnings,
    required num monthlyEarnings,
    required String averageResponseTime,
    required double acceptanceRate,
  }) {
    return ProviderDashboardDisplay(
      provider: repository.getProvider(),
      profile: repository.getProfile(),
      orders: repository.getOrders(),
      quotes: repository.getQuotes(),
      reviews: repository.getReviews(),
      payments: repository.getPayments(),
      todayEarnings: todayEarnings,
      weeklyEarnings: weeklyEarnings,
      monthlyEarnings: monthlyEarnings,
      averageResponseTime: averageResponseTime,
      acceptanceRate: acceptanceRate,
    );
  }
}
