import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/features/reviews/repositories/mock_reviews_repository.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/review/entities/review.dart';
import 'package:mobile/service/entities/service.dart';

void main() {
  group('MockReviewsRepository', () {
    final repository = MockReviewsRepository();

    test('getReviews returns real Review entities, not maps', () async {
      final reviews = await repository.getReviews();
      expect(reviews, isNotEmpty);
      expect(reviews, everyElement(isA<Review>()));
    });

    test('returns reviews with four distinct ratings', () async {
      final reviews = await repository.getReviews();
      final ratings = reviews.map((r) => r.rating.value).toSet();
      expect(ratings, equals({5, 4, 3, 1}));
    });

    test('getProviderFor returns a real Provider entity, not a map', () async {
      final review = (await repository.getReviews()).first;
      expect(await repository.getProviderFor(review), isA<Provider>());
    });

    test('getProfileFor returns a real Profile with a display name', () async {
      final review = (await repository.getReviews()).first;
      final profile = await repository.getProfileFor(review);
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getOrderFor returns a real Order entity, not a map', () async {
      final review = (await repository.getReviews()).first;
      expect(await repository.getOrderFor(review), isA<Order>());
    });

    test('getServiceFor returns a real Service entity, not a map', () async {
      final review = (await repository.getReviews()).first;
      expect(await repository.getServiceFor(review), isA<Service>());
    });

    test('every review order references the same provider returned', () async {
      for (final review in await repository.getReviews()) {
        expect(
          (await repository.getOrderFor(review)).providerId,
          equals((await repository.getProviderFor(review)).id),
        );
      }
    });

    test('every review service references the order service id', () async {
      for (final review in await repository.getReviews()) {
        expect(
          (await repository.getServiceFor(review)).id,
          equals((await repository.getOrderFor(review)).serviceId),
        );
      }
    });

    test('is independent from every other feature mock data', () async {
      final reviews = await repository.getReviews();
      expect(
        reviews.every((review) => review.id.value.startsWith('reviews-')),
        isTrue,
      );
    });
  });
}
