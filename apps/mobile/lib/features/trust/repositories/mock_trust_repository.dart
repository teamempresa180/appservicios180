import '../../../identity/entities/identity.dart';
import '../../../trust/entities/trust.dart';
import '../mock/mock_trust_data.dart';
import 'trust_repository.dart';

/// In-memory `TrustRepository` backed by fixed mock data. No backend,
/// no persistence, no network, no real scoring — see the feature
/// README.
class MockTrustRepository implements TrustRepository {
  @override
  Future<Identity> getIdentity() => Future.value(mockTrustIdentity);

  @override
  Future<Trust> getTrust() => Future.value(mockTrust);
}
