import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';

/// Presentation-only composition of everything the Verification screen
/// needs: two real domain entities, [identity] and [profile].
///
/// **Every simulated field this model used to carry was removed.** It
/// previously fabricated `verificationStatus` ("En revisión"),
/// `completedSteps` ("Documento de identidad subido", "Selfie
/// capturada"), `pendingSteps`, `rejectedReason` and
/// `estimatedReviewTime` ("Aproximadamente 24 a 48 horas hábiles") as
/// fixed constants — so every real provider, including one who had
/// never uploaded anything, was told the app held their documents and
/// was reviewing them. On the screen whose entire subject is identity
/// and trust, that is not a placeholder; it is a false statement about
/// the user's own account.
///
/// The screen now shows only what the backend actually knows: the real
/// `Identity` on file. The domain does have a real `Verification`
/// entity (`verification/entities/verification.dart`), but this
/// feature's repository is deliberately scoped to `Identity`/`Profile`
/// (see `verification_repository.dart`), and no backend endpoint
/// resolves a `Verification` for the current provider yet — see the
/// feature README's "Cómo se conectará con Backend" section.
class VerificationDisplay {
  const VerificationDisplay({required this.identity, required this.profile});

  final Identity identity;
  final Profile profile;

  String get displayName => profile.displayName;

  /// The document number with everything but the last four characters
  /// masked — enough for the provider to confirm it is the right
  /// document, without printing a full government ID on screen.
  String get maskedDocumentNumber {
    final number = identity.documentNumber.trim();
    if (number.length <= 4) return number;
    return '${'•' * (number.length - 4)}${number.substring(number.length - 4)}';
  }
}
