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

    test('getAll returns real Category entities, not maps', () async {
      final categories = await repository.getAll();

      expect(categories, isNotEmpty);
      expect(categories, everyElement(isA<Category>()));
      expect(categories.map((c) => c.name), contains('Plomería'));
    });

    test('getById resolves a known category', () async {
      final categories = await repository.getAll();
      final found = await repository.getById(categories.first.id);

      expect(found, isNotNull);
      expect(found!.id, equals(categories.first.id));
    });

    test('getById returns null for an unknown id', () async {
      final unknown = await repository.getById(CategoryId.fromString('nope'));
      expect(unknown, isNull);
    });
  });

  group('MockServiceRepository', () {
    final repository = MockServiceRepository();

    test('getFeatured returns real Service entities, not maps', () async {
      final services = await repository.getFeatured();

      expect(services, isNotEmpty);
      expect(services, everyElement(isA<Service>()));
    });

    test('ratingOf returns a simulated rating for a known service', () async {
      final services = await repository.getFeatured();
      final rating = await repository.ratingOf(services.first.id);

      expect(rating, isA<double>());
      expect(rating, greaterThan(0));
    });
  });

  group('MockProviderRepository', () {
    final repository = MockProviderRepository();

    test('getRecommended returns real Provider entities, not maps', () async {
      final providers = await repository.getRecommended();

      expect(providers, isNotEmpty);
      expect(providers, everyElement(isA<Provider>()));
    });

    test('profileOf resolves a real Profile with a display name', () async {
      final providers = await repository.getRecommended();
      final profile = await repository.profileOf(providers.first.id);

      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('ratingOf and servicesCountOf return simulated numbers', () async {
      final providers = await repository.getRecommended();
      final rating = await repository.ratingOf(providers.first.id);
      final count = await repository.servicesCountOf(providers.first.id);

      expect(rating, isA<double>());
      expect(count, isA<int>());
    });
  });
}
