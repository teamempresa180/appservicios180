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
  Provider getProvider() => mockDashboardProvider;

  @override
  Profile getProfile() => mockDashboardProfile;

  @override
  List<Order> getOrders() => List.unmodifiable(mockDashboardOrders);

  @override
  List<Quote> getQuotes() => List.unmodifiable(mockDashboardQuotes);

  @override
  List<Review> getReviews() => List.unmodifiable(mockDashboardReviews);

  @override
  List<Payment> getPayments() => List.unmodifiable(mockDashboardPayments);
}
