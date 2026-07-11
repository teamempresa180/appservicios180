import '../../../identity/entities/identity.dart';
import '../../../trust/entities/trust.dart';

/// Local (on-device) source for the domain entities the Trust screen
/// needs. No implementation — see `PROJECT_STATUS.md` (Sprint 2,
/// Etapa 6).
abstract class TrustLocalDataSource {
  Identity getIdentity();
  Trust getTrust();
}
