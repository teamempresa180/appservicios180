import '../../../availability/entities/availability.dart';
import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';

/// Presentation-only composition of everything a Provider Profile
/// screen needs. Composes six real domain entities/collections —
/// [provider], [profile], [availability], [reviews], [services],
/// [categories] — plus fields that either don't exist on any domain
/// entity yet, or are simulated/derived:
///
/// - [rating] and [reviewsCount]: derived here from [reviews] (average
///   of `Review.rating`, and its length) — same approach as
///   `service_detail`'s `ServiceDetailData`.
/// - [experienceYears]: **not fabricated** — it is a direct passthrough
///   of the real `Provider.yearsOfExperience` domain field, exposed
///   here under the name the UI spec asked for. Listed as "simulado"
///   in the prompt, but documented here as real domain data to avoid
///   inventing a second, inconsistent number.
/// - [completedServices], [responseTime]: fully simulated — no
///   `Order`/`Review` aggregation endpoint exists yet to compute these.
/// - [coverImages]: fully simulated — the domain has no cover/gallery
///   concept for `Provider`, and no real images/illustrations exist yet
///   (no official branding). Plain labels rendered as neutral
///   placeholders.
/// - [about]: simulated — longer than `Provider.biography`, which is a
///   short one-liner in the domain mock data.
/// - [specialties]: fully simulated — no domain equivalent.
///
/// Nothing here is added to the domain entities themselves.
class ProviderProfileData {
  const ProviderProfileData({
    required this.provider,
    required this.profile,
    required this.availability,
    required this.reviews,
    required this.services,
    required this.categories,
    required this.rating,
    required this.reviewsCount,
    required this.completedServices,
    required this.responseTime,
    required this.coverImages,
    required this.about,
    required this.specialties,
  });

  final Provider provider;
  final Profile profile;
  final Availability availability;
  final List<Review> reviews;
  final List<Service> services;
  final List<Category> categories;

  /// Simulated/derived — see the class doc.
  final double rating;

  /// Simulated/derived — see the class doc.
  final int reviewsCount;

  /// Simulated — see the class doc.
  final int completedServices;

  /// Simulated — see the class doc.
  final String responseTime;

  /// Simulated — see the class doc. Only the first entry is currently
  /// rendered (see `ProviderCover`).
  final List<String> coverImages;

  /// Simulated — see the class doc.
  final String about;

  /// Simulated — see the class doc.
  final List<String> specialties;

  String get name => profile.displayName;

  /// Real domain data (`Provider.yearsOfExperience`) — see the class
  /// doc for why this isn't a separately fabricated value.
  int get experienceYears => provider.yearsOfExperience;
}
