import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';

/// Contract for reading the domain entities the Verification screen
/// needs. Returns only real domain entities — no `Map`, no `dynamic`,
/// no JSON. Implemented today by `MockVerificationRepository`; a
/// future `ApiVerificationRepository` would implement this same
/// interface (see the feature README).
///
/// Deliberately scoped to `Identity`/`Profile` only, per the prompt —
/// see the feature README and `VerificationDisplay`'s class doc for
/// why the real `Verification` domain entity isn't used here yet.
abstract class VerificationRepository {
  Future<Identity> getIdentity();
  Future<Profile> getProfile();
}
