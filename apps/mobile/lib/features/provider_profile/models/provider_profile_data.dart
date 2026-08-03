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
/// - [coverImages]: fully simulated — the domain has no cover/gallery
///   concept for `Provider`, and no real images/illustrations exist yet
///   (no official branding). Plain labels rendered as neutral
///   placeholders.
/// - [about]: **now real** — a passthrough of `Provider.biography`,
///   the provider's own text. It used to be a fixed mock paragraph
///   ("Plomera independiente con más de 8 años de experiencia...")
///   rendered on *every* provider's profile, so a real electrician's
///   page described someone else's plumbing business to real clients.
///   Empty when the provider wrote no biography — [ProviderInformation]
///   hides the section rather than inventing one.
/// - [specialties]: **now derived** — the distinct names of the
///   categories this provider actually publishes services in. Also
///   previously a fixed mock list shown on every profile.
/// - `completedServices`/`responseTime` were removed outright: no
///   `Order`/`Review` aggregation endpoint exists to compute either,
///   so both could only ever show a fabricated "47" and "Responde en
///   menos de 1 hora" to clients deciding whom to hire.
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
    required this.coverImages,
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

  /// Simulated — see the class doc. Only the first entry is currently
  /// rendered (see `ProviderCover`).
  final List<String> coverImages;

  /// Real domain data (`Provider.biography`) — see the class doc.
  String get about => provider.biography.trim();

  /// Derived from the real [categories] of this provider's published
  /// [services] — see the class doc. Empty when they publish none, in
  /// which case `ProviderSpecialties` hides itself.
  List<String> get specialties {
    final publishedCategoryIds = services
        .map((service) => service.categoryId)
        .toSet();
    final names = <String>[];
    for (final category in categories) {
      if (publishedCategoryIds.contains(category.id) &&
          !names.contains(category.name)) {
        names.add(category.name);
      }
    }
    return names;
  }

  String get name => profile.displayName;

  /// Real domain data (`Provider.yearsOfExperience`) — see the class
  /// doc for why this isn't a separately fabricated value.
  int get experienceYears => provider.yearsOfExperience;
}
