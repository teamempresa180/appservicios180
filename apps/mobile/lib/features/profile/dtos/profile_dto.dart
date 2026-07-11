import '../../../address/entities/address.dart';
import '../../../contact/entities/contact.dart';
import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';

/// Plain data shape a future `ProfileRemoteDataSource` would receive
/// from a real API response for this screen — the same fields
/// [ProfileDisplay] composes, but without its derived getters (e.g.
/// `memberSince`, computed by `ProfileMapper`/the widgets). No
/// `fromJson`/`toJson` yet — only the structure, see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
class ProfileDto {
  const ProfileDto({
    required this.profile,
    required this.identity,
    required this.contacts,
    required this.address,
    required this.completionPercentage,
    required this.profileCompletionItems,
  });

  final Profile profile;
  final Identity identity;
  final List<Contact> contacts;
  final Address address;
  final int completionPercentage;
  final List<String> profileCompletionItems;
}
