import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/features/tracking/entities/tracking_session.dart';
import 'package:mobile/features/tracking/models/tracking_session_id.dart';
import 'package:mobile/features/tracking/models/tracking_session_status.dart';
import 'package:mobile/order/models/order_id.dart';
import 'package:mobile/provider/models/provider_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = TrackingSessionId.create();
    final orderId = OrderId.create();
    final providerId = ProviderId.create();
    final startedAt = DateTime(2026, 1, 1);

    final session = TrackingSession(
      id: id,
      orderId: orderId,
      providerId: providerId,
      status: TrackingSessionStatus.active,
      startedAt: startedAt,
    );

    expect(session.id, id);
    expect(session.orderId, orderId);
    expect(session.providerId, providerId);
    expect(session.status, TrackingSessionStatus.active);
    expect(session.startedAt, startedAt);
  });

  test('is equal to another session with the same id', () {
    final id = TrackingSessionId.create();
    final orderId = OrderId.create();
    final providerId = ProviderId.create();

    TrackingSession build() => TrackingSession(
      id: id,
      orderId: orderId,
      providerId: providerId,
      status: TrackingSessionStatus.notStarted,
      startedAt: null,
    );

    expect(build(), equals(build()));
  });

  test('copyWith overrides status and startedAt without changing identity', () {
    final id = TrackingSessionId.create();
    final orderId = OrderId.create();
    final providerId = ProviderId.create();
    final original = TrackingSession(
      id: id,
      orderId: orderId,
      providerId: providerId,
      status: TrackingSessionStatus.notStarted,
      startedAt: null,
    );

    final startedAt = DateTime(2026, 3, 1);
    final started = original.copyWith(
      status: TrackingSessionStatus.active,
      startedAt: startedAt,
    );

    expect(started.id, id);
    expect(started.orderId, orderId);
    expect(started.providerId, providerId);
    expect(started.status, TrackingSessionStatus.active);
    expect(started.startedAt, startedAt);
    // Unaffected fields fall back to the original.
    expect(original.status, TrackingSessionStatus.notStarted);
  });

  test('allows a null startedAt while notStarted', () {
    final session = TrackingSession(
      id: TrackingSessionId.create(),
      orderId: OrderId.create(),
      providerId: ProviderId.create(),
      status: TrackingSessionStatus.notStarted,
      startedAt: null,
    );

    expect(session.startedAt, isNull);
  });
}
