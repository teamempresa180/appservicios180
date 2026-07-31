import '../../../core/base/value_object.dart';
import 'route_point.dart';

/// The calculated path from the provider's position to the client's
/// destination.
///
/// Modeled as an **encoded polyline string** (Google's
/// [polyline algorithm format](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)),
/// not a `List<RoutePoint>` — because that's literally the shape a
/// real integration will receive: the Google Maps Directions API
/// returns `routes[0].overview_polyline.points` as one opaque encoded
/// string, not a JSON array of `{lat, lng}` objects. Modeling it as a
/// list here would mean re-decoding it once on arrival just to store
/// it as a list, then re-encoding (or leaving un-encoded, deviating
/// from the real shape) — extra work with no benefit before there's a
/// real Directions API call to receive from. Decoding happens lazily
/// via [waypoints], so today's mock/tests can also build a
/// `TrackingRoute` straight from known points using
/// [TrackingRoute.fromPoints] without hand-writing polyline strings.
class TrackingRoute extends ValueObject {
  const TrackingRoute({required this.encodedPolyline});

  /// Two points is a degenerate-but-valid "route" — a straight line —
  /// which is all `MockTrackingRepository` needs; a real Directions
  /// API response would encode many more intermediate points to follow
  /// actual roads.
  factory TrackingRoute.fromPoints(List<RoutePoint> points) {
    return TrackingRoute(encodedPolyline: _encodePolyline(points));
  }

  /// Google polyline-algorithm-encoded path.
  final String encodedPolyline;

  /// Decodes [encodedPolyline] back into waypoints — the presentation
  /// layer calls this to draw the route on the map. Decoded on demand
  /// rather than cached, since nothing here is a rendering hot path
  /// (recomputed once per `TrackingUpdate` tick at most).
  List<RoutePoint> get waypoints => _decodePolyline(encodedPolyline);

  @override
  List<Object?> get props => [encodedPolyline];
}

/// Standard Google polyline algorithm encoder (precision 5, i.e.
/// coordinates rounded to 1e-5 degrees) — kept local to this file, no
/// external package, mirroring how `MockTrackingRepository` already
/// hand-rolls its own haversine distance rather than pulling in a geo
/// package for one formula.
String _encodePolyline(List<RoutePoint> points) {
  final buffer = StringBuffer();
  var prevLat = 0;
  var prevLng = 0;
  for (final point in points) {
    final lat = (point.latitude * 1e5).round();
    final lng = (point.longitude * 1e5).round();
    _encodeValue(lat - prevLat, buffer);
    _encodeValue(lng - prevLng, buffer);
    prevLat = lat;
    prevLng = lng;
  }
  return buffer.toString();
}

void _encodeValue(int value, StringBuffer buffer) {
  var v = value < 0 ? ~(value << 1) : (value << 1);
  while (v >= 0x20) {
    buffer.writeCharCode((0x20 | (v & 0x1f)) + 63);
    v >>= 5;
  }
  buffer.writeCharCode(v + 63);
}

List<RoutePoint> _decodePolyline(String encoded) {
  final points = <RoutePoint>[];
  var index = 0;
  var lat = 0;
  var lng = 0;

  while (index < encoded.length) {
    lat += _decodeValue(encoded, () => index, (i) => index = i);
    lng += _decodeValue(encoded, () => index, (i) => index = i);
    points.add(RoutePoint(latitude: lat / 1e5, longitude: lng / 1e5));
  }
  return points;
}

int _decodeValue(
  String encoded,
  int Function() getIndex,
  void Function(int) setIndex,
) {
  var result = 0;
  var shift = 0;
  var index = getIndex();
  int b;
  do {
    b = encoded.codeUnitAt(index++) - 63;
    result |= (b & 0x1f) << shift;
    shift += 5;
  } while (b >= 0x20);
  setIndex(index);
  return (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
}
