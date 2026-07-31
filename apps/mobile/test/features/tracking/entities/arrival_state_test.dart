import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/features/tracking/entities/arrival_state.dart';

void main() {
  group('ArrivalStateThresholds.fromDistanceMeters', () {
    test('is notStarted when the session has not started, regardless of distance', () {
      expect(
        ArrivalStateThresholds.fromDistanceMeters(0, sessionStarted: false),
        ArrivalState.notStarted,
      );
    });

    test('is enRoute when far from the destination', () {
      expect(
        ArrivalStateThresholds.fromDistanceMeters(2000, sessionStarted: true),
        ArrivalState.enRoute,
      );
    });

    test('is nearby under the nearby threshold', () {
      expect(
        ArrivalStateThresholds.fromDistanceMeters(200, sessionStarted: true),
        ArrivalState.nearby,
      );
    });

    test('is arrived under the arrived threshold', () {
      expect(
        ArrivalStateThresholds.fromDistanceMeters(5, sessionStarted: true),
        ArrivalState.arrived,
      );
    });

    test('nearby/arrived boundaries are inclusive', () {
      expect(
        ArrivalStateThresholds.fromDistanceMeters(
          ArrivalStateThresholds.nearbyMeters,
          sessionStarted: true,
        ),
        ArrivalState.nearby,
      );
      expect(
        ArrivalStateThresholds.fromDistanceMeters(
          ArrivalStateThresholds.arrivedMeters,
          sessionStarted: true,
        ),
        ArrivalState.arrived,
      );
    });
  });
}
