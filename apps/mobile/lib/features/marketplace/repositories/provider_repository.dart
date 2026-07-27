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

  /// Average rating for [id], derived from real `Review` records.
  Future<double> ratingOf(ProviderId id);

  /// Real count of `Service` records that belong to [id].
  Future<int> servicesCountOf(ProviderId id);
}
