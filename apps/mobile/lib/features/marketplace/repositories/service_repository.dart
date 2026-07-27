import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';

/// Contract for reading `Service` data for the Marketplace. Implemented
/// today by `MockServiceRepository`; a future `ApiServiceRepository` or
/// `FirebaseServiceRepository` would implement this same interface (see
/// the feature README).
abstract class ServiceRepository {
  Future<List<Service>> getFeatured();

  /// Average rating for [id], derived from real `Review` records (via
  /// the service's provider — see `HttpMarketplaceServiceRepository`'s
  /// doc comment for why `Review` only links to a provider, not a
  /// service, directly).
  Future<double> ratingOf(ServiceId id);
}
