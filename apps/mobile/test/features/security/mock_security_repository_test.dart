import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/audit/entities/audit.dart';
import 'package:mobile/authentication/entities/authentication.dart';
import 'package:mobile/authentication/models/auth_method_type.dart';
import 'package:mobile/authentication/models/authentication_status.dart';
import 'package:mobile/credentials/entities/credential.dart';
import 'package:mobile/features/security/repositories/mock_security_repository.dart';
import 'package:mobile/identity/entities/identity.dart';

void main() {
  group('MockSecurityRepository', () {
    final repository = MockSecurityRepository();

    test('getIdentity returns a real Identity entity, not a map', () async {
      expect(await repository.getIdentity(), isA<Identity>());
    });

    test('getAuthMethods returns real Authentication entities, not maps', () async {
      final methods = await repository.getAuthMethods();
      expect(methods, isNotEmpty);
      expect(methods, everyElement(isA<Authentication>()));
    });

    test('returns five methods covering every type and status', () async {
      final methods = await repository.getAuthMethods();
      expect(methods.length, equals(5));
      expect(methods.map((a) => a.methodType).toSet().length, equals(5));
      expect(methods.map((a) => a.status).toSet().length, equals(4));
    });

    test('every method references the same identity returned', () async {
      final identityId = (await repository.getIdentity()).id;
      final methods = await repository.getAuthMethods();
      expect(methods.every((a) => a.identityId == identityId), isTrue);
    });

    test('getCredentials returns real Credential entities, not maps', () async {
      final credentials = await repository.getCredentials();
      expect(credentials, isNotEmpty);
      expect(credentials, everyElement(isA<Credential>()));
    });

    test('returns four credentials covering every type and status', () async {
      final credentials = await repository.getCredentials();
      expect(credentials.length, equals(4));
      expect(credentials.map((c) => c.type).toSet().length, equals(4));
      expect(credentials.map((c) => c.status).toSet().length, equals(3));
    });

    test('every credential references the same identity returned', () async {
      final identityId = (await repository.getIdentity()).id;
      final credentials = await repository.getCredentials();
      expect(credentials.every((c) => c.identityId == identityId), isTrue);
    });

    test('getAuditLog returns real Audit entities, not maps', () async {
      final auditLog = await repository.getAuditLog();
      expect(auditLog, isNotEmpty);
      expect(auditLog, everyElement(isA<Audit>()));
    });

    test('returns five audit entries with real descriptions', () async {
      final auditLog = await repository.getAuditLog();
      expect(auditLog.length, equals(5));
      expect(auditLog.every((a) => a.description.isNotEmpty), isTrue);
    });

    test('every audit entry references the same identity returned', () async {
      final identityId = (await repository.getIdentity()).id;
      final auditLog = await repository.getAuditLog();
      expect(auditLog.every((a) => a.identityId == identityId), isTrue);
    });

    test('is independent from every other feature mock data', () async {
      final identity = await repository.getIdentity();
      expect(identity.id.value.startsWith('security-'), isTrue);
    });

    test('createAuthMethod adds a real, active Authentication', () async {
      final freshRepository = MockSecurityRepository();
      final identity = await freshRepository.getIdentity();
      final before = await freshRepository.getAuthMethods();
      final created = await freshRepository.createAuthMethod(
        identity: identity,
        methodType: AuthMethodType.biometric,
      );
      final after = await freshRepository.getAuthMethods();

      expect(after.length, equals(before.length + 1));
      expect(created.identityId, equals(identity.id));
      expect(created.status, equals(AuthenticationStatus.active));
      expect(after, contains(created));
    });

    test('updateAuthMethodStatus changes only the targeted method', () async {
      final freshRepository = MockSecurityRepository();
      final methods = await freshRepository.getAuthMethods();
      final target = methods.first;

      final updated = await freshRepository.updateAuthMethodStatus(
        target,
        AuthenticationStatus.inactive,
      );

      expect(updated.status, equals(AuthenticationStatus.inactive));
      final after = await freshRepository.getAuthMethods();
      expect(
        after.firstWhere((a) => a.id == target.id).status,
        equals(AuthenticationStatus.inactive),
      );
    });

    test('deleteAuthMethod removes the targeted method', () async {
      final freshRepository = MockSecurityRepository();
      final before = await freshRepository.getAuthMethods();
      final target = before.first;

      await freshRepository.deleteAuthMethod(target);

      final after = await freshRepository.getAuthMethods();
      expect(after.length, equals(before.length - 1));
      expect(after.any((a) => a.id == target.id), isFalse);
    });
  });
}
