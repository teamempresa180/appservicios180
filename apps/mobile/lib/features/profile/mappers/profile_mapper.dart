import '../../../address/entities/address.dart';
import '../../../contact/entities/contact.dart';
import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';
import '../models/profile_display.dart';
import '../repositories/profile_repository.dart';

/// Composes a [ProfileDisplay] from a [ProfileRepository] plus the
/// fields still simulated in this feature (see `ProfileDisplay`'s
/// class doc) — the conversion this feature's page used to do inline
/// in `_buildData()`. Depends on the repository *contract*, not
/// `MockProfileRepository` (see `PROJECT_STATUS.md`, Sprint 2, Etapa
/// 6). `Future`-returning since [ProfileRepository]'s methods are.
abstract final class ProfileMapper {
  static Future<ProfileDisplay> toDisplay({
    required ProfileRepository repository,
    required int completionPercentage,
    required List<String> profileCompletionItems,
  }) async {
    final results = await Future.wait([
      repository.getProfile(),
      repository.getIdentity(),
      repository.getContacts(),
      repository.getAddress(),
    ]);
    final profile = results[0] as Profile;
    final identity = results[1] as Identity;
    final contacts = results[2] as List<Contact>;
    final address = results[3] as Address;
    return ProfileDisplay(
      profile: profile,
      identity: identity,
      contacts: contacts,
      address: address,
      completionPercentage: completionPercentage,
      profileCompletionItems: profileCompletionItems,
    );
  }
}
