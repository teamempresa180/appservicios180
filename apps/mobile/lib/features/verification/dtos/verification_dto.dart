import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';
import '../models/verification_status_display.dart';

/// Plain data shape a future `VerificationRemoteDataSource` would
/// receive from a real API response for this screen — the same
/// fields [VerificationDisplay] composes, but without its derived
/// getters. No `fromJson`/`toJson` yet — only the structure, see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
class VerificationDto {
  const VerificationDto({
    required this.identity,
    required this.profile,
    required this.verificationStatus,
    required this.completedSteps,
    required this.pendingSteps,
    required this.rejectedReason,
    required this.estimatedReviewTime,
  });

  final Identity identity;
  final Profile profile;
  final VerificationStatusDisplay verificationStatus;
  final List<String> completedSteps;
  final List<String> pendingSteps;
  final String? rejectedReason;
  final String estimatedReviewTime;
}
