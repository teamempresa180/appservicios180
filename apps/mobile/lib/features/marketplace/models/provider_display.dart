import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';

/// Presentation-only composition of a [Provider] with the extra display
/// data a card needs (its [Profile] for the display name, a real
/// rating derived from `Review` records and a real services count).
/// `Provider` itself has no name, rating or service count directly —
/// those either live on a different aggregate (`Profile`) or are
/// computed by `ProviderRepository.ratingOf`/`servicesCountOf`. No
/// `Map`, no `dynamic` — every field is typed.
class ProviderDisplay {
  const ProviderDisplay({
    required this.provider,
    required this.profile,
    required this.rating,
    required this.servicesCount,
  });

  final Provider provider;
  final Profile profile;
  final double rating;
  final int servicesCount;

  String get name => profile.displayName;
}
