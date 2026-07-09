import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/audit/entities/audit.dart';
import 'package:mobile/audit/models/audit_id.dart';
import 'package:mobile/audit/models/audit_action_type.dart';
import 'package:mobile/identity/models/identity_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = AuditId.create();
    final identityId = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    final audit = Audit(
      id: id,
      identityId: identityId,
      actionType: AuditActionType.loggedIn,
      description: 'User logged in from a new device',
      occurredAt: now,
    );

    expect(audit.id, id);
    expect(audit.identityId, identityId);
    expect(audit.actionType, AuditActionType.loggedIn);
    expect(audit.occurredAt, now);
  });
}
