import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';

/// Contract for reading `Provider` data for the Marketplace. Implemented
/// today by `MockProviderRepository`; a future `ApiProviderRepository` or
/// `FirebaseProviderRepository` would implement this same interface (see
/// the feature README).
abstract class ProviderRepository {
  Future<List<Provider>> getRecommended();

  /// The `Profile` that carries this provider's display name. `Provider`
  /// itself only stores a `ProfileId` reference (per the domain's "no
  /// embedded entities" rule) — never a name directly.
  Future<Profile> profileOf(ProviderId id);

  /// Simulated rating for [id] — no `Review` aggregate is consulted yet.
  Future<double> ratingOf(ProviderId id);

  /// Simulated count for [id] — no real `Service` lookup is performed.
  Future<int> servicesCountOf(ProviderId id);
}
