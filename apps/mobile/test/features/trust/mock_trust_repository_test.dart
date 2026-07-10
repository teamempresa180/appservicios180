import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/features/trust/repositories/mock_trust_repository.dart';
import 'package:mobile/identity/entities/identity.dart';
import 'package:mobile/trust/entities/trust.dart';

void main() {
  group('MockTrustRepository', () {
    final repository = MockTrustRepository();

    test('getIdentity returns a real Identity entity, not a map', () {
      expect(repository.getIdentity(), isA<Identity>());
    });

    test('getTrust returns a real Trust entity, not a map', () {
      expect(repository.getTrust(), isA<Trust>());
    });

    test('trust references the same identity returned', () {
      expect(
        repository.getTrust().identityId,
        equals(repository.getIdentity().id),
      );
    });

    test('is independent from every other feature mock data', () {
      expect(repository.getIdentity().id.value.startsWith('trust-'), isTrue);
      expect(repository.getTrust().id.value.startsWith('trust-'), isTrue);
    });
  });
}
