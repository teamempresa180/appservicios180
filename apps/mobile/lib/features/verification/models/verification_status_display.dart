/// The verification states this screen can show. **Fully simulated** —
/// see `VerificationDisplay` and the feature README. Named
/// `VerificationStatusDisplay` (not `VerificationStatus`) to avoid any
/// confusion with the real domain enum of the same name in
/// `verification/models/verification_status.dart`, which this feature
/// intentionally does not import (the prompt restricted this
/// repository to `Identity`/`Profile` only — see the feature README
/// for why a real `Verification` domain entity exists but isn't used
/// here).
enum VerificationStatusDisplay { pending, approved, rejected }

extension VerificationStatusDisplayLabel on VerificationStatusDisplay {
  String get label {
    switch (this) {
      case VerificationStatusDisplay.pending:
        return 'En revisión';
      case VerificationStatusDisplay.approved:
        return 'Aprobada';
      case VerificationStatusDisplay.rejected:
        return 'Rechazada';
    }
  }
}
