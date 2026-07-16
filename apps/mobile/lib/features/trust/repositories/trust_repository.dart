import '../../../identity/entities/identity.dart';
import '../../../trust/entities/trust.dart';

/// Contract for reading the domain entities the Trust screen needs.
/// Returns only real domain entities — no `Map`, no `dynamic`, no
/// JSON. Implemented today by `MockTrustRepository`; a future
/// `ApiTrustRepository` would implement this same interface (see the
/// feature README).
abstract class TrustRepository {
  Future<Identity> getIdentity();
  Future<Trust> getTrust();
}
