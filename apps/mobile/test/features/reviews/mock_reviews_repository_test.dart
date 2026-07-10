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

    test('getReviews returns real Review entities, not maps', () {
      final reviews = repository.getReviews();
      expect(reviews, isNotEmpty);
      expect(reviews, everyElement(isA<Review>()));
    });

    test('returns reviews with four distinct ratings', () {
      final ratings = repository
          .getReviews()
          .map((r) => r.rating.value)
          .toSet();
      expect(ratings, equals({5, 4, 3, 1}));
    });

    test('getProviderFor returns a real Provider entity, not a map', () {
      final review = repository.getReviews().first;
      expect(repository.getProviderFor(review), isA<Provider>());
    });

    test('getProfileFor returns a real Profile with a display name', () {
      final review = repository.getReviews().first;
      final profile = repository.getProfileFor(review);
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getOrderFor returns a real Order entity, not a map', () {
      final review = repository.getReviews().first;
      expect(repository.getOrderFor(review), isA<Order>());
    });

    test('getServiceFor returns a real Service entity, not a map', () {
      final review = repository.getReviews().first;
      expect(repository.getServiceFor(review), isA<Service>());
    });

    test('every review order references the same provider returned', () {
      for (final review in repository.getReviews()) {
        expect(
          repository.getOrderFor(review).providerId,
          equals(repository.getProviderFor(review).id),
        );
      }
    });

    test('every review service references the order service id', () {
      for (final review in repository.getReviews()) {
        expect(
          repository.getServiceFor(review).id,
          equals(repository.getOrderFor(review).serviceId),
        );
      }
    });

    test('is independent from every other feature mock data', () {
      expect(
        repository.getReviews().every(
          (review) => review.id.value.startsWith('reviews-'),
        ),
        isTrue,
      );
    });
  });
}
