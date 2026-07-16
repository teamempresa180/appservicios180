import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/entities/category.dart';
import 'package:mobile/features/provider_services/repositories/mock_provider_services_repository.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/service/entities/service.dart';

void main() {
  group('MockProviderServicesRepository', () {
    final repository = MockProviderServicesRepository();

    test('getProvider returns a real Provider entity, not a map', () async {
      expect(await repository.getProvider(), isA<Provider>());
    });

    test('getProfile returns a real Profile with a display name', () async {
      final profile = await repository.getProfile();
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getServices returns real Service entities, not maps', () async {
      final services = await repository.getServices();
      expect(services, isNotEmpty);
      expect(services, everyElement(isA<Service>()));
    });

    test('returns services with three distinct statuses', () async {
      final services = await repository.getServices();
      final statuses = services.map((s) => s.status).toSet();
      expect(statuses.length, equals(3));
    });

    test('getCategoryFor returns a real Category entity, not a map', () async {
      final services = await repository.getServices();
      final service = services.first;
      expect(await repository.getCategoryFor(service), isA<Category>());
    });

    test('every service references the same provider returned', () async {
      final providerId = (await repository.getProvider()).id;
      final services = await repository.getServices();
      expect(
        services.every((s) => s.providerId == providerId),
        isTrue,
      );
    });

    test('is independent from every other feature mock data', () async {
      final provider = await repository.getProvider();
      expect(provider.id.value.startsWith('provider-services-'), isTrue);
    });
  });
}
