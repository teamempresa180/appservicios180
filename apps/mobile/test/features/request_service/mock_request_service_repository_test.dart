import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/address/entities/address.dart';
import 'package:mobile/availability/entities/availability.dart';
import 'package:mobile/category/entities/category.dart';
import 'package:mobile/features/request_service/repositories/mock_request_service_repository.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/service/entities/service.dart';

void main() {
  group('MockRequestServiceRepository', () {
    final repository = MockRequestServiceRepository();

    test('getService returns a real Service entity, not a map', () {
      expect(repository.getService(), isA<Service>());
    });

    test('getProvider returns a real Provider entity, not a map', () {
      expect(repository.getProvider(), isA<Provider>());
    });

    test('getProfile returns a real Profile with a display name', () {
      final profile = repository.getProfile();
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getCategory returns a real Category entity, not a map', () {
      expect(repository.getCategory(), isA<Category>());
    });

    test('getAvailability returns a real Availability entity', () {
      expect(repository.getAvailability(), isA<Availability>());
    });

    test('getAddress returns a real Address entity, not a map', () {
      expect(repository.getAddress(), isA<Address>());
    });

    test('service, availability and provider reference the same provider id', () {
      final providerId = repository.getProvider().id;
      expect(repository.getService().providerId, equals(providerId));
      expect(repository.getAvailability().providerId, equals(providerId));
    });

    test('service references the same category id', () {
      expect(
        repository.getService().categoryId,
        equals(repository.getCategory().id),
      );
    });

    test('is independent from every other feature mock data', () {
      expect(
        repository.getProvider().id.value.startsWith('request-service-'),
        isTrue,
      );
    });
  });
}
