import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/availability/entities/availability.dart';
import 'package:mobile/category/entities/category.dart';
import 'package:mobile/features/provider_profile/repositories/mock_provider_profile_repository.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/review/entities/review.dart';
import 'package:mobile/service/entities/service.dart';

void main() {
  group('MockProviderProfileRepository', () {
    final repository = MockProviderProfileRepository();

    test('getProvider returns a real Provider entity, not a map', () {
      expect(repository.getProvider(), isA<Provider>());
    });

    test('getProfile returns a real Profile with a display name', () {
      final profile = repository.getProfile();
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getAvailability returns a real Availability entity', () {
      expect(repository.getAvailability(), isA<Availability>());
    });

    test('getReviews returns real Review entities, not maps', () {
      final reviews = repository.getReviews();
      expect(reviews, isNotEmpty);
      expect(reviews, everyElement(isA<Review>()));
    });

    test('getServices returns real Service entities, not maps', () {
      final services = repository.getServices();
      expect(services, isNotEmpty);
      expect(services, everyElement(isA<Service>()));
    });

    test('getCategories returns real Category entities, not maps', () {
      final categories = repository.getCategories();
      expect(categories, isNotEmpty);
      expect(categories, everyElement(isA<Category>()));
    });

    test('services and availability reference the same provider id', () {
      final providerId = repository.getProvider().id;
      expect(
        repository.getServices().every((s) => s.providerId == providerId),
        isTrue,
      );
      expect(repository.getAvailability().providerId, equals(providerId));
    });

    test('is independent from every other feature mock data', () {
      expect(
        repository.getProvider().id.value.startsWith('provider-profile-'),
        isTrue,
      );
    });
  });
}
