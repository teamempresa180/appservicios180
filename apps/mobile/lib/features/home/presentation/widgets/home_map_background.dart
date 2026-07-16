import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

/// Full-bleed map behind the Uber/inDrive-style floating panel (Cliente
/// Home only). Static camera for now — centered on a default city
/// location, no live "my location" tracking yet (that needs a location
/// permission flow, e.g. via `geolocator`, not wired up in this pass).
///
/// Uses a muted custom style (labels/POI icons stripped down) so the map
/// reads as a quiet backdrop rather than competing with the floating
/// panel — matching the app's minimalist gold/black/white redesign.
class HomeMapBackground extends StatelessWidget {
  const HomeMapBackground({super.key});

  static const CameraPosition _defaultCamera = CameraPosition(
    target: LatLng(4.7110, -74.0721), // Bogotá centro, placeholder default.
    zoom: 14,
  );

  static const String _mutedStyle = '''
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

  @override
  Widget build(BuildContext context) {
    return GoogleMap(
      initialCameraPosition: _defaultCamera,
      style: _mutedStyle,
      zoomControlsEnabled: false,
      mapToolbarEnabled: false,
      myLocationButtonEnabled: false,
      compassEnabled: false,
      buildingsEnabled: false,
    );
  }
}
