import 'package:collection/collection.dart';

import '../../../category/models/category_id.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';
import '../mock/mock_providers_data.dart';
import 'provider_repository.dart';

/// In-memory `ProviderRepository` backed by fixed mock data. No backend,
/// no persistence, no network — see the feature README.
class MockProviderRepository implements ProviderRepository {
  @override
  Future<List<Provider>> getRecommended() =>
      Future.value(List.unmodifiable(mockProviders));

  /// No real category/specialization data exists on the fixed mock
  /// providers — every active mock provider is returned regardless of
  /// [categoryId]/[specialization], same "no real filter yet" shape as
  /// this repository's other mock methods.
  @override
  Future<List<Provider>> getCompatible({
    required CategoryId categoryId,
    String? specialization,
  }) => Future.value(List.unmodifiable(mockProviders));

  @override
  Future<Profile> profileOf(ProviderId id) {
    final provider = mockProviders.firstWhereOrNull((p) => p.id == id);
    return Future.value(
      mockProviderProfiles.firstWhere(
        (profile) => profile.id == provider?.providerProfileId,
        orElse: () => mockProviderProfiles.first,
      ),
    );
  }

  @override
  Future<double> ratingOf(ProviderId id) =>
      Future.value(mockProviderRatings[id.value] ?? 4.5);

  @override
  Future<int> servicesCountOf(ProviderId id) =>
      Future.value(mockProviderServicesCount[id.value] ?? 0);
}
