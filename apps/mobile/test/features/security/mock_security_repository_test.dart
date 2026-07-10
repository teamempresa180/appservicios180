import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/authentication/entities/authentication.dart';
import 'package:mobile/credentials/entities/credential.dart';
import 'package:mobile/features/security/repositories/mock_security_repository.dart';
import 'package:mobile/identity/entities/identity.dart';

void main() {
  group('MockSecurityRepository', () {
    final repository = MockSecurityRepository();

    test('getIdentity returns a real Identity entity, not a map', () {
      expect(repository.getIdentity(), isA<Identity>());
    });

    test('getAuthMethods returns real Authentication entities, not maps', () {
      final methods = repository.getAuthMethods();
      expect(methods, isNotEmpty);
      expect(methods, everyElement(isA<Authentication>()));
    });

    test('returns five methods covering every type and status', () {
      final methods = repository.getAuthMethods();
      expect(methods.length, equals(5));
      expect(methods.map((a) => a.methodType).toSet().length, equals(5));
      expect(methods.map((a) => a.status).toSet().length, equals(4));
    });

    test('every method references the same identity returned', () {
      final identityId = repository.getIdentity().id;
      expect(
        repository.getAuthMethods().every((a) => a.identityId == identityId),
        isTrue,
      );
    });

    test('getCredentials returns real Credential entities, not maps', () {
      final credentials = repository.getCredentials();
      expect(credentials, isNotEmpty);
      expect(credentials, everyElement(isA<Credential>()));
    });

    test('returns four credentials covering every type and status', () {
      final credentials = repository.getCredentials();
      expect(credentials.length, equals(4));
      expect(credentials.map((c) => c.type).toSet().length, equals(4));
      expect(credentials.map((c) => c.status).toSet().length, equals(3));
    });

    test('every credential references the same identity returned', () {
      final identityId = repository.getIdentity().id;
      expect(
        repository.getCredentials().every((c) => c.identityId == identityId),
        isTrue,
      );
    });

    test('is independent from every other feature mock data', () {
      expect(repository.getIdentity().id.value.startsWith('security-'), isTrue);
    });
  });
}
