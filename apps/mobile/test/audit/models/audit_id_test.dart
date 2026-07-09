import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/audit/models/audit_id.dart';

void main() {
  test('creates unique ids', () {
    final a = AuditId.create();
    final b = AuditId.create();
    expect(a.value == b.value, isFalse);
  });

  test('is equal by value', () {
    final a = AuditId.fromString('same-id');
    final b = AuditId.fromString('same-id');
    expect(a, equals(b));
  });
}
