import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/review/entities/review.dart';
import 'package:mobile/review/models/review_id.dart';
import 'package:mobile/review/models/review_rating.dart';
import 'package:mobile/review/models/review_status.dart';
import 'package:mobile/order/models/order_id.dart';
import 'package:mobile/provider/models/provider_id.dart';
import 'package:mobile/identity/models/identity_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = ReviewId.create();
    final orderId = OrderId.create();
    final providerId = ProviderId.create();
    final reviewerIdentityId = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    final review = Review(
      id: id,
      orderId: orderId,
      providerId: providerId,
      reviewerIdentityId: reviewerIdentityId,
      rating: const ReviewRating.of(5),
      title: 'Excelente servicio',
      comment: 'Muy puntual y profesional',
      status: ReviewStatus.published,
      createdAt: now,
      updatedAt: now,
    );

    expect(review.id, id);
    expect(review.orderId, orderId);
    expect(review.providerId, providerId);
    expect(review.reviewerIdentityId, reviewerIdentityId);
    expect(review.rating.value, 5);
    expect(review.title, 'Excelente servicio');
    expect(review.status, ReviewStatus.published);
  });

  test('is equal to another review with the same id', () {
    final id = ReviewId.create();
    final orderId = OrderId.create();
    final providerId = ProviderId.create();
    final reviewerIdentityId = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    Review build() => Review(
      id: id,
      orderId: orderId,
      providerId: providerId,
      reviewerIdentityId: reviewerIdentityId,
      rating: const ReviewRating.of(4),
      title: 'Bien',
      comment: 'Comentario',
      status: ReviewStatus.pending,
      createdAt: now,
      updatedAt: now,
    );

    expect(build(), equals(build()));
  });
}
