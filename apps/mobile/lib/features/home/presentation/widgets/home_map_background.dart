import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

/// Full-bleed map behind the Uber/inDrive-style floating panel (Cliente
/// Home) or a fixed-height card (Proveedor Home). Static camera —
/// centered on a default city location — but shows the device's real
/// "my location" dot (with a heading arrow, Google Maps' built-in
/// indicator) once location permission is granted, for both roles: see
/// [_requestLocationPermission].
///
/// Uses a muted custom style (labels/POI icons stripped down) so the map
/// reads as a quiet backdrop rather than competing with the floating
/// panel — matching the app's minimalist gold/black/white redesign.
/// [isDark] swaps in a near-black Uber-style filter instead of the light
/// muted one, so the map follows the app's own dark mode instead of
/// staying a jarring white rectangle on a black screen — recomputed
/// from `Theme.of(context).brightness` on every build (see
/// `ClientHomeContent`), so `GoogleMap`'s own `style` diffing keeps it
/// in sync whenever the user toggles dark mode.
class HomeMapBackground extends StatefulWidget {
  const HomeMapBackground({
    super.key,
    required this.isDark,
    this.onCameraMoveStarted,
    this.onCameraIdle,
  });

  final bool isDark;
  final VoidCallback? onCameraMoveStarted;
  final VoidCallback? onCameraIdle;

  static const CameraPosition _defaultCamera = CameraPosition(
    target: LatLng(4.7110, -74.0721), // Bogotá centro, placeholder default.
    zoom: 14,
  );

  static const String _lightStyle = '''
  [
    {"featureType": "poi", "elementType": "labels", "stylers": [{"visibility": "off"}]},
    {"featureType": "transit", "elementType": "labels", "stylers": [{"visibility": "off"}]},
    {"featureType": "road", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]},
    {"featureType": "landscape", "elementType": "geometry", "stylers": [{"color": "#f5f2e9"}]},
    {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#e4dcc8"}]},
    {"featureType": "road", "elementType": "geometry", "stylers": [{"color": "#ffffff"}]},
    {"featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#eef2e3"}]}
  ]
  ''';

  /// Near-black, low-chroma filter — same silhouette as the Uber/inDrive
  /// dark map (charcoal base, muted grey roads/labels, no blues) so it
  /// blends into the app's black scaffold instead of standing out.
  static const String _darkStyle = '''
  [
    {"elementType": "geometry", "stylers": [{"color": "#1c1c1e"}]},
    {"elementType": "labels.icon", "stylers": [{"visibility": "off"}]},
    {"elementType": "labels.text.fill", "stylers": [{"color": "#8e8e93"}]},
    {"elementType": "labels.text.stroke", "stylers": [{"color": "#1c1c1e"}]},
    {"featureType": "poi", "elementType": "labels", "stylers": [{"visibility": "off"}]},
    {"featureType": "transit", "elementType": "labels", "stylers": [{"visibility": "off"}]},
    {"featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#1f2a1f"}]},
    {"featureType": "road", "elementType": "geometry", "stylers": [{"color": "#2c2c2e"}]},
    {"featureType": "road", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]},
    {"featureType": "road.highway", "elementType": "geometry", "stylers": [{"color": "#38383a"}]},
    {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#0e0e10"}]}
  ]
  ''';

  static String styleFor(bool isDark) => isDark ? _darkStyle : _lightStyle;

  @override
  State<HomeMapBackground> createState() => _HomeMapBackgroundState();
}

class _HomeMapBackgroundState extends State<HomeMapBackground> {
  bool _myLocationEnabled = false;

  @override
  void initState() {
    super.initState();
    _requestLocationPermission();
  }

  /// Requests device location permission and, if granted, turns on
  /// Google Maps' own "my location" indicator (a blue dot with a
  /// heading arrow/cone) — the "flechita" showing where the account is,
  /// for both Cliente and Proveedor Home. Fails silently (leaves the
  /// indicator off) if the location service is disabled or permission
  /// is denied — this is a non-blocking enhancement, not something the
  /// Home screen should ever error out over.
  Future<void> _requestLocationPermission() async {
    try {
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) return;

      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        return;
      }
      if (!mounted) return;
      setState(() => _myLocationEnabled = true);
    } catch (_) {
      // Permission plugin/platform channel failure — leave the
      // indicator off, same as a denied permission.
    }
  }

  @override
  Widget build(BuildContext context) {
    return GoogleMap(
      key: const ValueKey('home-map'),
      initialCameraPosition: HomeMapBackground._defaultCamera,
      style: HomeMapBackground.styleFor(widget.isDark),
      zoomControlsEnabled: false,
      mapToolbarEnabled: false,
      myLocationEnabled: _myLocationEnabled,
      myLocationButtonEnabled: _myLocationEnabled,
      compassEnabled: false,
      buildingsEnabled: false,
      onCameraMoveStarted: widget.onCameraMoveStarted,
      onCameraIdle: widget.onCameraIdle,
    );
  }
}
