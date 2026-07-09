import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/attachment/models/attachment_id.dart';

void main() {
  test('creates unique ids', () {
    final a = AttachmentId.create();
    final b = AttachmentId.create();
    expect(a.value == b.value, isFalse);
  });

  test('wraps an existing string value', () {
    final id = AttachmentId.fromString('fixed-id');
    expect(id.value, 'fixed-id');
  });

  test('is equal by value', () {
    final a = AttachmentId.fromString('same-id');
    final b = AttachmentId.fromString('same-id');
    expect(a, equals(b));
  });
}
