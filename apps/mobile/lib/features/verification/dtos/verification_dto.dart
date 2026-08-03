import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';

/// Plain data shape a future `VerificationRemoteDataSource` would
/// receive from a real API response for this screen — the same
/// fields [VerificationDisplay] composes, but without its derived
/// getters. No `fromJson`/`toJson` yet — only the structure, see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
///
/// Tracks `VerificationDisplay`: the simulated status/steps/review-time
/// fields were dropped from both (see that class's doc comment).
class VerificationDto {
  const VerificationDto({required this.identity, required this.profile});

  final Identity identity;
  final Profile profile;
}
