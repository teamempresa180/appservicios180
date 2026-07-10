import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/entities/category.dart';
import 'package:mobile/features/provider_services/repositories/mock_provider_services_repository.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/service/entities/service.dart';

void main() {
  group('MockProviderServicesRepository', () {
    final repository = MockProviderServicesRepository();

    test('getProvider returns a real Provider entity, not a map', () {
      expect(repository.getProvider(), isA<Provider>());
    });

    test('getProfile returns a real Profile with a display name', () {
      final profile = repository.getProfile();
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getServices returns real Service entities, not maps', () {
      final services = repository.getServices();
      expect(services, isNotEmpty);
      expect(services, everyElement(isA<Service>()));
    });

    test('returns services with three distinct statuses', () {
      final statuses = repository.getServices().map((s) => s.status).toSet();
      expect(statuses.length, equals(3));
    });

    test('getCategoryFor returns a real Category entity, not a map', () {
      final service = repository.getServices().first;
      expect(repository.getCategoryFor(service), isA<Category>());
    });

    test('every service references the same provider returned', () {
      final providerId = repository.getProvider().id;
      expect(
        repository.getServices().every((s) => s.providerId == providerId),
        isTrue,
      );
    });

    test('is independent from every other feature mock data', () {
      expect(
        repository.getProvider().id.value.startsWith('provider-services-'),
        isTrue,
      );
    });
  });
}
