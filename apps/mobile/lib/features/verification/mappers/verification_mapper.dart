import '../models/verification_display.dart';
import '../models/verification_status_display.dart';
import '../repositories/verification_repository.dart';

/// Composes a [VerificationDisplay] from a [VerificationRepository]
/// plus the fields still simulated in this feature (see
/// `VerificationDisplay`'s class doc) — the conversion this feature's
/// page used to do inline in `_buildData()`. Depends on the
/// repository *contract*, not `MockVerificationRepository` (see
/// `PROJECT_STATUS.md`, Sprint 2, Etapa 6).
abstract final class VerificationMapper {
  static VerificationDisplay toDisplay({
    required VerificationRepository repository,
    required VerificationStatusDisplay verificationStatus,
    required List<String> completedSteps,
    required List<String> pendingSteps,
    required String? rejectedReason,
    required String estimatedReviewTime,
  }) {
    return VerificationDisplay(
      identity: repository.getIdentity(),
      profile: repository.getProfile(),
      verificationStatus: verificationStatus,
      completedSteps: completedSteps,
      pendingSteps: pendingSteps,
      rejectedReason: rejectedReason,
      estimatedReviewTime: estimatedReviewTime,
    );
  }
}
