import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/features/tracking/models/tracking_session_id.dart';

void main() {
  test('creates unique ids', () {
    final a = TrackingSessionId.create();
    final b = TrackingSessionId.create();
    expect(a.value == b.value, isFalse);
  });

  test('wraps an existing string value', () {
    final id = TrackingSessionId.fromString('fixed-id');
    expect(id.value, 'fixed-id');
  });

  test('is equal by value', () {
    final a = TrackingSessionId.fromString('same-id');
    final b = TrackingSessionId.fromString('same-id');
    expect(a, equals(b));
  });
}
