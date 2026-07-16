import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/audit/entities/audit.dart';
import 'package:mobile/authentication/entities/authentication.dart';
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
  });
}
