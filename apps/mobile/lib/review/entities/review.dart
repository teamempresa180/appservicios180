import '../../core/base/entity.dart';
import '../../order/models/order_id.dart';
import '../../provider/models/provider_id.dart';
import '../../identity/models/identity_id.dart';
import '../models/review_id.dart';
import '../models/review_rating.dart';
import '../models/review_status.dart';

/// Represents a review a customer leaves after an order is completed.
/// Pure data holder — no reputation, no trust score calculation, no
/// moderation, no reports, no AI, no persistence, no business rules.
class Review extends Entity<ReviewId> {
  const Review({
    required ReviewId id,
    required this.orderId,
    required this.providerId,
    required this.reviewerIdentityId,
    required this.rating,
    required this.title,
    required this.comment,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final OrderId orderId;
  final ProviderId providerId;
  final IdentityId reviewerIdentityId;
  final ReviewRating rating;
  final String title;
  final String comment;
  final ReviewStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;
}
