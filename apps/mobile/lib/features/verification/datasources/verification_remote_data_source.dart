import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';

/// Remote (API/Firebase) source for the domain entities the
/// Verification screen needs — where a real KYC/verification provider
/// integration would eventually live. No implementation — see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
abstract class VerificationRemoteDataSource {
  Future<Identity> getIdentity();
  Future<Profile> getProfile();
}
