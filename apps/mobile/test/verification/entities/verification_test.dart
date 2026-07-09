import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/verification/entities/verification.dart';
import 'package:mobile/verification/models/verification_id.dart';
import 'package:mobile/verification/models/verification_type.dart';
import 'package:mobile/verification/models/verification_status.dart';
import 'package:mobile/identity/models/identity_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = VerificationId.create();
    final identityId = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    final verification = Verification(
      id: id,
      identityId: identityId,
      type: VerificationType.document,
      status: VerificationStatus.approved,
      verifiedAt: now,
      createdAt: now,
      updatedAt: now,
    );

    expect(verification.id, id);
    expect(verification.identityId, identityId);
    expect(verification.type, VerificationType.document);
    expect(verification.status, VerificationStatus.approved);
  });
}
