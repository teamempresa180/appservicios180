import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/entities/category.dart';
import 'package:mobile/features/service_detail/repositories/mock_service_detail_repository.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/review/entities/review.dart';
import 'package:mobile/service/entities/service.dart';

void main() {
  group('MockServiceDetailRepository', () {
    final repository = MockServiceDetailRepository();

    test('getService returns a real Service entity, not a map', () async {
      final service = await repository.getService();
      expect(service, isA<Service>());
      expect(service.name, isNotEmpty);
    });

    test('getProvider returns a real Provider entity', () async {
      expect(await repository.getProvider(), isA<Provider>());
    });

    test('getProviderProfile returns a real Profile with a display name', () async {
      final profile = await repository.getProviderProfile();
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getCategory returns a real Category entity', () async {
      expect(await repository.getCategory(), isA<Category>());
    });

    test('getReviews returns real Review entities, not maps', () async {
      final reviews = await repository.getReviews();
      expect(reviews, isNotEmpty);
      expect(reviews, everyElement(isA<Review>()));
    });

    test('the Service references the same Provider and Category ids', () async {
      final service = await repository.getService();
      final provider = await repository.getProvider();
      final category = await repository.getCategory();
      expect(service.providerId, equals(provider.id));
      expect(service.categoryId, equals(category.id));
    });

    test('is independent from Marketplace/Categories/Search mock data', () async {
      final service = await repository.getService();
      expect(service.id.value.startsWith('service-detail-'), isTrue);
    });
  });
}
