import 'dart:async';
import 'dart:math';

import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../../../order/models/order_id.dart';
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
/// one every [tickInterval].
class MockTrackingRepository implements TrackingRepository {
  static const _origin = LatLng(4.7110, -74.0721);
  static const totalTicks = 30;
  static const tickInterval = Duration(seconds: 2);

  @override
  Stream<TrackingUpdate> watchTracking(OrderId orderId) {
    final seed = orderId.value.hashCode;
    final random = Random(seed);
    // Both points within ~3km of the default camera — far enough to
    // show real movement on the map, close enough to stay on-screen at
    // the zoom level `TrackingMap` uses.
    final start = LatLng(
      _origin.latitude + (random.nextDouble() - 0.5) * 0.03,
      _origin.longitude + (random.nextDouble() - 0.5) * 0.03,
    );
    final destination = LatLng(
      _origin.latitude + (random.nextDouble() - 0.5) * 0.03,
      _origin.longitude + (random.nextDouble() - 0.5) * 0.03,
    );

    late final StreamController<TrackingUpdate> controller;
    var tick = 0;
    Timer? timer;

    void emit() {
      final progress = (tick / totalTicks).clamp(0.0, 1.0);
      final position = LatLng(
        start.latitude + (destination.latitude - start.latitude) * progress,
        start.longitude +
            (destination.longitude - start.longitude) * progress,
      );
      final distanceMeters = _haversineDistanceMeters(position, destination);
      final remainingTicks = totalTicks - tick;
      final hasArrived = progress >= 1.0;
      controller.add(
        TrackingUpdate(
          providerPosition: hasArrived ? destination : position,
          destination: destination,
          etaMinutes: hasArrived
              ? 0
              : (remainingTicks * tickInterval.inSeconds / 60).ceil(),
          distanceMeters: hasArrived ? 0 : distanceMeters,
          hasArrived: hasArrived,
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

/// Haversine distance in meters — kept local to this mock (not a
/// shared utility) since it only exists to make the simulated ETA/
/// distance numbers look plausible, not for any real geolocation need.
double _haversineDistanceMeters(LatLng a, LatLng b) {
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

double _degToRad(double deg) => deg * pi / 180;
