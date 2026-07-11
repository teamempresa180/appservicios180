import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';

/// Local (on-device) source for `Provider` data for the Marketplace.
/// No implementation — see `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
abstract class ProviderLocalDataSource {
  List<Provider> getRecommended();
  Profile profileOf(ProviderId id);
  double ratingOf(ProviderId id);
  int servicesCountOf(ProviderId id);
}
