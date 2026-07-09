import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/entities/category.dart';
import 'package:mobile/category/models/category_id.dart';
import 'package:mobile/features/marketplace/repositories/mock_category_repository.dart';
import 'package:mobile/features/marketplace/repositories/mock_provider_repository.dart';
import 'package:mobile/features/marketplace/repositories/mock_service_repository.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/service/entities/service.dart';

void main() {
  group('MockCategoryRepository', () {
    final repository = MockCategoryRepository();

    test('getAll returns real Category entities, not maps', () {
      final categories = repository.getAll();

      expect(categories, isNotEmpty);
      expect(categories, everyElement(isA<Category>()));
      expect(categories.map((c) => c.name), contains('Plomería'));
    });

    test('getById resolves a known category', () {
      final categories = repository.getAll();
      final found = repository.getById(categories.first.id);

      expect(found, isNotNull);
      expect(found!.id, equals(categories.first.id));
    });

    test('getById returns null for an unknown id', () {
      final unknown = repository.getById(CategoryId.fromString('nope'));
      expect(unknown, isNull);
    });
  });

  group('MockServiceRepository', () {
    final repository = MockServiceRepository();

    test('getFeatured returns real Service entities, not maps', () {
      final services = repository.getFeatured();

      expect(services, isNotEmpty);
      expect(services, everyElement(isA<Service>()));
    });

    test('ratingOf returns a simulated rating for a known service', () {
      final services = repository.getFeatured();
      final rating = repository.ratingOf(services.first.id);

      expect(rating, isA<double>());
      expect(rating, greaterThan(0));
    });
  });

  group('MockProviderRepository', () {
    final repository = MockProviderRepository();

    test('getRecommended returns real Provider entities, not maps', () {
      final providers = repository.getRecommended();

      expect(providers, isNotEmpty);
      expect(providers, everyElement(isA<Provider>()));
    });

    test('profileOf resolves a real Profile with a display name', () {
      final providers = repository.getRecommended();
      final profile = repository.profileOf(providers.first.id);

      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('ratingOf and servicesCountOf return simulated numbers', () {
      final providers = repository.getRecommended();
      final rating = repository.ratingOf(providers.first.id);
      final count = repository.servicesCountOf(providers.first.id);

      expect(rating, isA<double>());
      expect(count, isA<int>());
    });
  });
}
