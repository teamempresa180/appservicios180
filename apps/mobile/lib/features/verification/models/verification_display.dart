import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';
import 'verification_status_display.dart';

/// Presentation-only composition of everything the Verification screen
/// needs. Composes two real domain entities — [identity], [profile] —
/// plus fields with no domain equivalent in **this feature's**
/// composition:
///
/// - [verificationStatus], [completedSteps], [pendingSteps],
///   [rejectedReason], [estimatedReviewTime]: **fully simulated**, as
///   explicitly listed by the prompt.
///
/// **Important note on `Verification` the domain module**: the domain
/// already has a real `Verification` entity
/// (`verification/entities/verification.dart`) with a `VerificationStatus`
/// enum (`pending`/`approved`/`rejected`/`expired`) that models exactly
/// this concept. Unlike every other "simulated field that already has
/// a real equivalent" case documented across this project (e.g.
/// `OrderDisplay.scheduledDate`, `ProviderServiceDisplay.isPublished`),
/// this one is **not** switched to a derived getter — the prompt
/// explicitly restricted this feature's repository to `Identity`/
/// `Profile` only ("Utilizar únicamente: Identity, Profile"), so
/// `Verification` is deliberately left unused here. See the feature
/// README's "Cómo se conectará con Backend" section for how a future
/// version would likely replace these simulated fields with a real
/// `VerificationRepository` extended to also return
/// `List<Verification>`.
///
/// Nothing here is added to the domain entities themselves. No `Color`
/// or `IconData` is stored anywhere in this model — every widget
/// resolves both purely from `context.colors.*`/`Icons.*` at build
/// time.
class VerificationDisplay {
  const VerificationDisplay({
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

  /// Simulated — see the class doc.
  final VerificationStatusDisplay verificationStatus;

  /// Simulated — see the class doc.
  final List<String> completedSteps;

  /// Simulated — see the class doc.
  final List<String> pendingSteps;

  /// Simulated — see the class doc. Only meaningful when
  /// [verificationStatus] is `rejected`; `null` otherwise.
  final String? rejectedReason;

  /// Simulated — see the class doc.
  final String estimatedReviewTime;

  String get displayName => profile.displayName;
}
