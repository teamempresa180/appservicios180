import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';

/// Presentation-only composition of everything a Reviews card needs.
/// Composes five real domain entities — [review], [provider],
/// [profile], [order], [service] — plus fields with no domain
/// equivalent yet:
///
/// - [reviewerName]: **fully simulated** — `Review` only carries
///   `reviewerIdentityId` (an ID, per the domain's own golden rule of
///   referencing other modules only by ID), not a reviewer `Profile`.
///   No reviewer `Profile` is fetched by this feature (only the
///   *provider's*, via [profile]), so there is no real display name to
///   show for "Usuario" — this is a plain placeholder label.
/// - [isOwnReview], [canEdit]: **fully simulated** — no session/auth
///   concept exists yet to know which identity is the current user, so
///   "is this my review" can't be derived from anything real.
///
/// [formattedDate] is **derived**, not simulated — computed from the
/// real `Review.createdAt` (same judgment call already documented for
/// `OrderDisplay.scheduledDate`, `PaymentDisplay.paymentDate` and
/// `NotificationDisplay.timeAgo`: no second, fabricated timestamp).
///
/// Nothing here is added to the domain entities themselves. No `Color`
/// or `IconData` is stored anywhere in this model — `review_rating.dart`
/// and `review_actions.dart` resolve stars/icons purely from
/// `context.colors.*` and `Review.rating`.
class ReviewDisplay {
  const ReviewDisplay({
    required this.review,
    required this.provider,
    required this.profile,
    required this.order,
    required this.service,
    required this.reviewerName,
    required this.isOwnReview,
    required this.canEdit,
  });

  final Review review;
  final Provider provider;
  final Profile profile;
  final Order order;
  final Service service;

  /// Simulated — see the class doc.
  final String reviewerName;

  /// Simulated — see the class doc.
  final bool isOwnReview;

  /// Simulated — see the class doc.
  final bool canEdit;

  String get providerName => profile.displayName;

  /// Derived from the real `Review.createdAt` — see the class doc.
  String get formattedDate {
    final date = review.createdAt;
    final day = date.day.toString().padLeft(2, '0');
    final month = date.month.toString().padLeft(2, '0');
    return '$day/$month/${date.year}';
  }
}
