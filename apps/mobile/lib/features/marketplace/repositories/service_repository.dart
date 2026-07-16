import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';

/// Contract for reading `Service` data for the Marketplace. Implemented
/// today by `MockServiceRepository`; a future `ApiServiceRepository` or
/// `FirebaseServiceRepository` would implement this same interface (see
/// the feature README).
abstract class ServiceRepository {
  Future<List<Service>> getFeatured();

  /// Simulated rating for [id] — no `Review` aggregate is consulted yet.
  Future<double> ratingOf(ServiceId id);
}
