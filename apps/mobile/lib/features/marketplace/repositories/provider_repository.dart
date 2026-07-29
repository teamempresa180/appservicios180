import '../../../category/models/category_id.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';

/// Contract for reading `Provider` data for the Marketplace. Implemented
/// today by `MockProviderRepository`; a future `ApiProviderRepository` or
/// `FirebaseProviderRepository` would implement this same interface (see
/// the feature README).
abstract class ProviderRepository {
  Future<List<Provider>> getRecommended();

  /// Active providers compatible with [categoryId], optionally narrowed
  /// by a case-insensitive substring match on their `specialization`
  /// (`GET /providers/compatible?categoryId=&specialization=` on the
  /// real backend) — backs the Marketplace's category →
  /// specialization → compatible-providers browse flow.
  Future<List<Provider>> getCompatible({
    required CategoryId categoryId,
    String? specialization,
  });

  /// The `Profile` that carries this provider's display name. `Provider`
  /// itself only stores a `ProfileId` reference (per the domain's "no
  /// embedded entities" rule) — never a name directly.
  Future<Profile> profileOf(ProviderId id);

  /// Average rating for [id], derived from real `Review` records.
  Future<double> ratingOf(ProviderId id);

  /// Real count of `Service` records that belong to [id].
  Future<int> servicesCountOf(ProviderId id);
}
