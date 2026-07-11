import '../models/profile_display.dart';
import '../repositories/profile_repository.dart';

/// Composes a [ProfileDisplay] from a [ProfileRepository] plus the
/// fields still simulated in this feature (see `ProfileDisplay`'s
/// class doc) — the conversion this feature's page used to do inline
/// in `_buildData()`. Depends on the repository *contract*, not
/// `MockProfileRepository` (see `PROJECT_STATUS.md`, Sprint 2, Etapa
/// 6).
abstract final class ProfileMapper {
  static ProfileDisplay toDisplay({
    required ProfileRepository repository,
    required int completionPercentage,
    required List<String> profileCompletionItems,
  }) {
    return ProfileDisplay(
      profile: repository.getProfile(),
      identity: repository.getIdentity(),
      contacts: repository.getContacts(),
      address: repository.getAddress(),
      completionPercentage: completionPercentage,
      profileCompletionItems: profileCompletionItems,
    );
  }
}
