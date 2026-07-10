import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';
import '../mock/mock_verification_data.dart';
import 'verification_repository.dart';

/// In-memory `VerificationRepository` backed by fixed mock data. No
/// backend, no persistence, no network, no real authentication — see
/// the feature README.
class MockVerificationRepository implements VerificationRepository {
  @override
  Identity getIdentity() => mockVerificationIdentity;

  @override
  Profile getProfile() => mockVerificationProfile;
}
