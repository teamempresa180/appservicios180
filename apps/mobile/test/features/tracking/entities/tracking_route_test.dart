import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/features/tracking/entities/route_point.dart';
import 'package:mobile/features/tracking/entities/tracking_route.dart';

void main() {
  test('encodes and decodes back to the original points (roundtrip)', () {
    const points = [
      RoutePoint(latitude: 4.7110, longitude: -74.0721),
      RoutePoint(latitude: 4.7135, longitude: -74.0698),
      RoutePoint(latitude: 4.7200, longitude: -74.0650),
    ];

    final route = TrackingRoute.fromPoints(points);
    final decoded = route.waypoints;

    expect(decoded.length, points.length);
    for (var i = 0; i < points.length; i++) {
      expect(decoded[i].latitude, closeTo(points[i].latitude, 1e-5));
      expect(decoded[i].longitude, closeTo(points[i].longitude, 1e-5));
    }
  });

  test('produces a non-empty encoded polyline for a two-point route', () {
    final route = TrackingRoute.fromPoints(const [
      RoutePoint(latitude: 4.7110, longitude: -74.0721),
      RoutePoint(latitude: 4.7200, longitude: -74.0650),
    ]);

    expect(route.encodedPolyline, isNotEmpty);
  });

  test('is equal by encoded polyline', () {
    final a = TrackingRoute.fromPoints(const [
      RoutePoint(latitude: 1, longitude: 2),
    ]);
    final b = TrackingRoute.fromPoints(const [
      RoutePoint(latitude: 1, longitude: 2),
    ]);

    expect(a, equals(b));
  });

  test('handles negative coordinates in the roundtrip', () {
    const points = [
      RoutePoint(latitude: -33.8688, longitude: 151.2093),
      RoutePoint(latitude: -33.8700, longitude: 151.2000),
    ];

    final decoded = TrackingRoute.fromPoints(points).waypoints;

    expect(decoded[0].latitude, closeTo(points[0].latitude, 1e-5));
    expect(decoded[0].longitude, closeTo(points[0].longitude, 1e-5));
    expect(decoded[1].latitude, closeTo(points[1].latitude, 1e-5));
    expect(decoded[1].longitude, closeTo(points[1].longitude, 1e-5));
  });
}
