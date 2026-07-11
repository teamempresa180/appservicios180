import '../../../identity/entities/identity.dart';
import '../../../trust/entities/trust.dart';

/// Plain data shape a future `TrustRemoteDataSource` would receive
/// from a real API response for this screen — the same fields
/// [TrustDisplay] composes, but without its derived getters. No
/// `fromJson`/`toJson` yet — only the structure, see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
class TrustDto {
  const TrustDto({
    required this.identity,
    required this.trust,
    required this.factors,
  });

  final Identity identity;
  final Trust trust;
  final List<String> factors;
}
