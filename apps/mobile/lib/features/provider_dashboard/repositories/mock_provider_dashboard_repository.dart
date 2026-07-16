import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../review/entities/review.dart';
import '../mock/mock_provider_dashboard_data.dart';
import 'provider_dashboard_repository.dart';

/// In-memory `ProviderDashboardRepository` backed by fixed mock data.
/// No backend, no persistence, no network — see the feature README.
class MockProviderDashboardRepository implements ProviderDashboardRepository {
  @override
  Future<Provider> getProvider() => Future.value(mockDashboardProvider);

  @override
  Future<Profile> getProfile() => Future.value(mockDashboardProfile);

  @override
  Future<List<Order>> getOrders() =>
      Future.value(List.unmodifiable(mockDashboardOrders));

  @override
  Future<List<Quote>> getQuotes() =>
      Future.value(List.unmodifiable(mockDashboardQuotes));

  @override
  Future<List<Review>> getReviews() =>
      Future.value(List.unmodifiable(mockDashboardReviews));

  @override
  Future<List<Payment>> getPayments() =>
      Future.value(List.unmodifiable(mockDashboardPayments));
}
