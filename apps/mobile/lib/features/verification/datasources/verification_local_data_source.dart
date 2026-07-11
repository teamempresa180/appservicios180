import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';

/// Local (on-device) source for the domain entities the Verification
/// screen needs. No implementation — see `PROJECT_STATUS.md` (Sprint
/// 2, Etapa 6).
abstract class VerificationLocalDataSource {
  Identity getIdentity();
  Profile getProfile();
}
