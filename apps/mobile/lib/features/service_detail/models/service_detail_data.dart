import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';

/// Presentation-only composition of everything a Service Detail screen
/// needs. Composes five real domain entities — [service], [provider],
/// [profile], [category], [reviews] — plus fields that either don't
/// exist on any domain entity yet, or are simulated summaries of ones
/// that do:
///
/// - [rating] and [reviewsCount]: derived from [reviews] here (average
///   of `Review.rating`, and its length) — a real backend would likely
///   pre-aggregate these instead of shipping every `Review`, but no
///   such aggregation endpoint exists yet.
/// - [images]: fully simulated — the domain has no image/gallery
///   concept for `Service`, and no real images/illustrations exist yet
///   (no official branding). These are plain labels rendered as neutral
///   placeholders.
/// - [longDescription]: simulated — `Service.description` is a short
///   one-liner in the domain; a detail screen needs more context than
///   that provides.
///
/// Nothing here is added to the domain entities themselves.
class ServiceDetailData {
  const ServiceDetailData({
    required this.service,
    required this.provider,
    required this.profile,
    required this.category,
    required this.reviews,
    required this.rating,
    required this.reviewsCount,
    required this.images,
    required this.longDescription,
  });

  final Service service;
  final Provider provider;
  final Profile profile;
  final Category category;
  final List<Review> reviews;

  /// Simulated — see the class doc for how this is derived.
  final double rating;

  /// Simulated — see the class doc for how this is derived.
  final int reviewsCount;

  /// Simulated — no real images/illustrations exist yet.
  final List<String> images;

  /// Simulated — longer than `Service.description`.
  final String longDescription;

  String get providerName => profile.displayName;
}
