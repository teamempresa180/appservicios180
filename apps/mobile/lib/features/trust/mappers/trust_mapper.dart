import '../models/trust_display.dart';
import '../repositories/trust_repository.dart';

/// Composes a [TrustDisplay] from a [TrustRepository] plus [factors]
/// (still simulated — `Trust` has no scoring breakdown in the domain,
/// see `TrustDisplay`'s class doc) — the conversion this feature's
/// page used to do inline in `_buildData()`. Depends on the
/// repository *contract*, not `MockTrustRepository` (see
/// `PROJECT_STATUS.md`, Sprint 2, Etapa 6).
abstract final class TrustMapper {
  static TrustDisplay toDisplay({
    required TrustRepository repository,
    required List<String> factors,
  }) {
    return TrustDisplay(
      identity: repository.getIdentity(),
      trust: repository.getTrust(),
      factors: factors,
    );
  }
}
