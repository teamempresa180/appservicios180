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

    test('getProvider returns a real Provider entity, not a map', () async {
      expect(await repository.getProvider(), isA<Provider>());
    });

    test('getProfile returns a real Profile with a display name', () async {
      final profile = await repository.getProfile();
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getAvailability returns a real Availability entity', () async {
      expect(await repository.getAvailability(), isA<Availability>());
    });

    test('getReviews returns real Review entities, not maps', () async {
      final reviews = await repository.getReviews();
      expect(reviews, isNotEmpty);
      expect(reviews, everyElement(isA<Review>()));
    });

    test('getServices returns real Service entities, not maps', () async {
      final services = await repository.getServices();
      expect(services, isNotEmpty);
      expect(services, everyElement(isA<Service>()));
    });

    test('getCategories returns real Category entities, not maps', () async {
      final categories = await repository.getCategories();
      expect(categories, isNotEmpty);
      expect(categories, everyElement(isA<Category>()));
    });

    test('services and availability reference the same provider id', () async {
      final providerId = (await repository.getProvider()).id;
      final services = await repository.getServices();
      expect(services.every((s) => s.providerId == providerId), isTrue);
      expect(
        (await repository.getAvailability()).providerId,
        equals(providerId),
      );
    });

    test('is independent from every other feature mock data', () async {
      final provider = await repository.getProvider();
      expect(provider.id.value.startsWith('provider-profile-'), isTrue);
    });
  });
}
