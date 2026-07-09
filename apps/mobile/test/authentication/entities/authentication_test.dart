import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/authentication/entities/authentication.dart';
import 'package:mobile/authentication/models/authentication_id.dart';
import 'package:mobile/authentication/models/auth_method_type.dart';
import 'package:mobile/authentication/models/authentication_status.dart';
import 'package:mobile/identity/models/identity_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = AuthenticationId.create();
    final identityId = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    final authentication = Authentication(
      id: id,
      identityId: identityId,
      methodType: AuthMethodType.password,
      status: AuthenticationStatus.active,
      createdAt: now,
      updatedAt: now,
    );

    expect(authentication.id, id);
    expect(authentication.identityId, identityId);
    expect(authentication.methodType, AuthMethodType.password);
    expect(authentication.status, AuthenticationStatus.active);
  });
}
