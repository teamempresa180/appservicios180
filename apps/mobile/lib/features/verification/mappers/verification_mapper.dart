import '../models/verification_display.dart';
import '../repositories/verification_repository.dart';

/// Composes a [VerificationDisplay] from a [VerificationRepository] —
/// the conversion this feature's page used to do inline in
/// `_buildData()`. Depends on the repository *contract*, not
/// `MockVerificationRepository` (see `PROJECT_STATUS.md`, Sprint 2,
/// Etapa 6). `Future`-returning since [VerificationRepository]'s
/// methods are.
///
/// No simulated status/steps/review-time is injected anymore — see
/// `VerificationDisplay`'s class doc for why those were removed rather
/// than left as placeholders.
abstract final class VerificationMapper {
  static Future<VerificationDisplay> toDisplay({
    required VerificationRepository repository,
  }) async {
    final identity = await repository.getIdentity();
    final profile = await repository.getProfile();
    return VerificationDisplay(identity: identity, profile: profile);
  }
}
