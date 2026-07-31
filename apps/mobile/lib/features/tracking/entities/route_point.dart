import '../../../core/base/value_object.dart';

/// A single lat/lng point, with no timestamp/heading/speed — used for
/// the client's fixed [destination] and for the waypoints decoded from
/// a [TrackingRoute]'s polyline. Deliberately not the same type as
/// [CurrentLocation]: a route waypoint is a static geometry sample,
/// not a moment-in-time reading of where the provider's device was.
class RoutePoint extends ValueObject {
  const RoutePoint({required this.latitude, required this.longitude});

  final double latitude;
  final double longitude;

  @override
  List<Object?> get props => [latitude, longitude];
}
