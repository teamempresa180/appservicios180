import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/credentials/entities/credential.dart';
import 'package:mobile/credentials/models/credential_id.dart';
import 'package:mobile/credentials/models/credential_type.dart';
import 'package:mobile/credentials/models/credential_status.dart';
import 'package:mobile/identity/models/identity_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = CredentialId.create();
    final identityId = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    final credential = Credential(
      id: id,
      identityId: identityId,
      type: CredentialType.password,
      status: CredentialStatus.active,
      createdAt: now,
      updatedAt: now,
    );

    expect(credential.id, id);
    expect(credential.identityId, identityId);
    expect(credential.type, CredentialType.password);
    expect(credential.status, CredentialStatus.active);
  });
}
