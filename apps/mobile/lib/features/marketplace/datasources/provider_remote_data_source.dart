import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';

/// Remote (API/Firebase) source for `Provider` data for the
/// Marketplace. No implementation — see `PROJECT_STATUS.md` (Sprint 2,
/// Etapa 6).
abstract class ProviderRemoteDataSource {
  Future<List<Provider>> getRecommended();
  Future<Profile> profileOf(ProviderId id);
  Future<double> ratingOf(ProviderId id);
  Future<int> servicesCountOf(ProviderId id);
}
