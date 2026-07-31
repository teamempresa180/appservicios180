import 'dart:async';
import 'dart:math';

import '../../../order/models/order_id.dart';
import '../../../provider/models/provider_id.dart';
import '../entities/arrival_state.dart';
import '../entities/current_location.dart';
import '../entities/distance_remaining.dart';
import '../entities/eta.dart';
import '../entities/route_point.dart';
import '../entities/tracking_route.dart';
import '../entities/tracking_session.dart';
import '../models/tracking_session_id.dart';
import '../models/tracking_session_status.dart';
import '../models/tracking_update.dart';
import 'tracking_repository.dart';

/// Simulates a provider moving toward the client's destination — no
/// backend involved, no real GPS, no persistence (see
/// `TrackingRepository`'s doc comment for why: this is the visual/UX
/// piece of Fase 5, built ahead of the live-location backend so the
/// screen can be reviewed and tested now).
///
/// Since `Order`/`Address` carry no real coordinates yet, both the
/// starting point and the destination are derived deterministically
/// from [orderId] (same order id always produces the same simulated
/// route — stable across rebuilds) around the app's default map camera
/// (Bogotá centro — see `HomeMapBackground`). The provider "moves" in a
/// straight line from start to destination over [totalTicks] updates,
/// one every [tickInterval]. [_providerIdFor] fabricates a stable
/// `ProviderId` per order the same way, since there's no real Order
/// lookup here either.
class MockTrackingRepository implements TrackingRepository {
  static const _origin = _LatLng(4.7110, -74.0721);
  static const totalTicks = 30;
  static const tickInterval = Duration(seconds: 2);

  ProviderId _providerIdFor(OrderId orderId) =>
      ProviderId.fromString('mock-provider-${orderId.value}');

  TrackingSessionId _sessionIdFor(OrderId orderId) =>
      TrackingSessionId.fromString('mock-session-${orderId.value}');

  @override
  Future<TrackingSession> getCurrentSession(OrderId orderId) async {
    // Mirrors what a real implementation would report before the
    // provider has started sharing location: a session "exists"
    // conceptually the moment tracking is requested, but starts out
    // `active` here since the mock has no notion of a not-yet-started
    // gap — `watchTracking` starts moving on first tick regardless.
    return TrackingSession(
      id: _sessionIdFor(orderId),
      orderId: orderId,
      providerId: _providerIdFor(orderId),
      status: TrackingSessionStatus.active,
      startedAt: DateTime.now(),
    );
  }

  @override
  Stream<TrackingUpdate> watchTracking(OrderId orderId) {
    final seed = orderId.value.hashCode;
    final random = Random(seed);
    // Both points within ~3km of the default camera — far enough to
    // show real movement on the map, close enough to stay on-screen at
    // the zoom level `TrackingMap` uses.
    final start = _LatLng(
      _origin.latitude + (random.nextDouble() - 0.5) * 0.03,
      _origin.longitude + (random.nextDouble() - 0.5) * 0.03,
    );
    final destination = _LatLng(
      _origin.latitude + (random.nextDouble() - 0.5) * 0.03,
      _origin.longitude + (random.nextDouble() - 0.5) * 0.03,
    );
    final destinationPoint = RoutePoint(
      latitude: destination.latitude,
      longitude: destination.longitude,
    );
    // Computed once for the whole session — a straight line "route",
    // encoded exactly like a real Directions API response would be
    // (see `TrackingRoute`'s doc comment).
    final route = TrackingRoute.fromPoints([
      RoutePoint(latitude: start.latitude, longitude: start.longitude),
      destinationPoint,
    ]);

    final session = TrackingSession(
      id: _sessionIdFor(orderId),
      orderId: orderId,
      providerId: _providerIdFor(orderId),
      status: TrackingSessionStatus.active,
      startedAt: DateTime.now(),
    );

    late final StreamController<TrackingUpdate> controller;
    var tick = 0;
    Timer? timer;

    void emit() {
      final now = DateTime.now();
      final progress = (tick / totalTicks).clamp(0.0, 1.0);
      final position = _LatLng(
        start.latitude + (destination.latitude - start.latitude) * progress,
        start.longitude +
            (destination.longitude - start.longitude) * progress,
      );
      final distanceMeters = _haversineDistanceMeters(position, destination);
      final remainingTicks = totalTicks - tick;
      final hasArrived = progress >= 1.0;
      final providerPosition = hasArrived ? destination : position;
      final etaMinutes = hasArrived
          ? 0
          : (remainingTicks * tickInterval.inSeconds / 60).ceil();
      final resolvedDistanceMeters = hasArrived ? 0.0 : distanceMeters;

      controller.add(
        TrackingUpdate(
          session: hasArrived
              ? session.copyWith(status: TrackingSessionStatus.ended)
              : session,
          providerLocation: CurrentLocation(
            latitude: providerPosition.latitude,
            longitude: providerPosition.longitude,
            recordedAt: now,
            headingDegrees: _bearingDegrees(start, destination),
            speedMetersPerSecond: hasArrived ? 0 : _simulatedSpeed,
          ),
          destination: destinationPoint,
          route: route,
          eta: ETA(
            arrivalTime: now.add(Duration(minutes: etaMinutes)),
            calculatedAt: now,
          ),
          distanceRemaining: DistanceRemaining(resolvedDistanceMeters),
          arrivalState: ArrivalStateThresholds.fromDistanceMeters(
            resolvedDistanceMeters,
            sessionStarted: true,
          ),
        ),
      );
      if (hasArrived) {
        timer?.cancel();
        controller.close();
        return;
      }
      tick++;
    }

    controller = StreamController<TrackingUpdate>(
      onListen: () {
        emit();
        timer = Timer.periodic(tickInterval, (_) => emit());
      },
      onCancel: () => timer?.cancel(),
    );
    return controller.stream;
  }
}

/// Plausible constant speed (~30 km/h) used only to give the simulated
/// [CurrentLocation.speedMetersPerSecond] a realistic non-zero value.
const _simulatedSpeed = 8.33;

/// Minimal lat/lng pair, local to this mock — kept separate from
/// `RoutePoint`/`CurrentLocation` since it's purely an internal
/// calculation helper for simulated movement, not a domain type.
class _LatLng {
  const _LatLng(this.latitude, this.longitude);
  final double latitude;
  final double longitude;
}

/// Haversine distance in meters — kept local to this mock (not a
/// shared utility) since it only exists to make the simulated ETA/
/// distance numbers look plausible, not for any real geolocation need.
double _haversineDistanceMeters(_LatLng a, _LatLng b) {
  const earthRadiusMeters = 6371000.0;
  final dLat = _degToRad(b.latitude - a.latitude);
  final dLng = _degToRad(b.longitude - a.longitude);
  final lat1 = _degToRad(a.latitude);
  final lat2 = _degToRad(b.latitude);
  final h =
      sin(dLat / 2) * sin(dLat / 2) +
      sin(dLng / 2) * sin(dLng / 2) * cos(lat1) * cos(lat2);
  final c = 2 * atan2(sqrt(h), sqrt(1 - h));
  return earthRadiusMeters * c;
}

/// Compass bearing in degrees from [a] to [b] — used to give the
/// simulated `CurrentLocation.headingDegrees` a realistic value so
/// `TrackingMap` can rotate the provider's marker to face the
/// direction of travel.
double _bearingDegrees(_LatLng a, _LatLng b) {
  final lat1 = _degToRad(a.latitude);
  final lat2 = _degToRad(b.latitude);
  final dLng = _degToRad(b.longitude - a.longitude);
  final y = sin(dLng) * cos(lat2);
  final x = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(dLng);
  final bearing = atan2(y, x) * 180 / pi;
  return (bearing + 360) % 360;
}

double _degToRad(double deg) => deg * pi / 180;
