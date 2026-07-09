import 'package:collection/collection.dart';

import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';
import '../mock/mock_providers_data.dart';
import 'provider_repository.dart';

/// In-memory `ProviderRepository` backed by fixed mock data. No backend,
/// no persistence, no network — see the feature README.
class MockProviderRepository implements ProviderRepository {
  @override
  List<Provider> getRecommended() => List.unmodifiable(mockProviders);

  @override
  Profile profileOf(ProviderId id) {
    final provider = mockProviders.firstWhereOrNull((p) => p.id == id);
    return mockProviderProfiles.firstWhere(
      (profile) => profile.id == provider?.providerProfileId,
      orElse: () => mockProviderProfiles.first,
    );
  }

  @override
  double ratingOf(ProviderId id) => mockProviderRatings[id.value] ?? 4.5;

  @override
  int servicesCountOf(ProviderId id) => mockProviderServicesCount[id.value] ?? 0;
}
