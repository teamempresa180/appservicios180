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

    test('getProfileFor returns a real Profile with a display name', () async {
      final provider = await repository.getProvider();
      final profile = await repository.getProfileFor(provider);
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getAvailabilityFor returns a real Availability entity', () async {
      final provider = await repository.getProvider();
      expect(await repository.getAvailabilityFor(provider), isA<Availability>());
    });

    test('getReviewsFor returns real Review entities, not maps', () async {
      final provider = await repository.getProvider();
      final reviews = await repository.getReviewsFor(provider);
      expect(reviews, isNotEmpty);
      expect(reviews, everyElement(isA<Review>()));
    });

    test('getServicesFor returns real Service entities, not maps', () async {
      final provider = await repository.getProvider();
      final services = await repository.getServicesFor(provider);
      expect(services, isNotEmpty);
      expect(services, everyElement(isA<Service>()));
    });

    test('getCategoriesFor returns real Category entities, not maps', () async {
      final provider = await repository.getProvider();
      final services = await repository.getServicesFor(provider);
      final categories = await repository.getCategoriesFor(services);
      expect(categories, isNotEmpty);
      expect(categories, everyElement(isA<Category>()));
    });

    test('services and availability reference the same provider id', () async {
      final provider = await repository.getProvider();
      final providerId = provider.id;
      final services = await repository.getServicesFor(provider);
      expect(services.every((s) => s.providerId == providerId), isTrue);
      expect(
        (await repository.getAvailabilityFor(provider)).providerId,
        equals(providerId),
      );
    });

    test('is independent from every other feature mock data', () async {
      final provider = await repository.getProvider();
      expect(provider.id.value.startsWith('provider-profile-'), isTrue);
    });
  });
}
