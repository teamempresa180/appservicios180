import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../../../home/presentation/widgets/home_map_background.dart';
import '../../models/tracking_update.dart';

/// The live map for `OrderTrackingPage`: a marker for the provider's
/// current (simulated) position, a marker for the destination, and a
/// straight polyline between them — redrawn on every [update]. Reuses
/// `HomeMapBackground`'s light/dark style strings so the tracking map
/// matches the rest of the app instead of Google's default look.
class TrackingMap extends StatefulWidget {
  const TrackingMap({super.key, required this.update, required this.isDark});

  final TrackingUpdate update;
  final bool isDark;

  @override
  State<TrackingMap> createState() => _TrackingMapState();
}

class _TrackingMapState extends State<TrackingMap> {
  GoogleMapController? _controller;

  LatLngBounds _boundsFor(TrackingUpdate update) {
    final provider = update.providerPosition;
    final destination = update.destination;
    return LatLngBounds(
      southwest: LatLng(
        provider.latitude < destination.latitude
            ? provider.latitude
            : destination.latitude,
        provider.longitude < destination.longitude
            ? provider.longitude
            : destination.longitude,
      ),
      northeast: LatLng(
        provider.latitude > destination.latitude
            ? provider.latitude
            : destination.latitude,
        provider.longitude > destination.longitude
            ? provider.longitude
            : destination.longitude,
      ),
    );
  }

  void _fitBounds(TrackingUpdate update) {
    final controller = _controller;
    if (controller == null) return;
    controller.animateCamera(
      CameraUpdate.newLatLngBounds(_boundsFor(update), 80),
    );
  }

  @override
  void didUpdateWidget(covariant TrackingMap oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.update.providerPosition != widget.update.providerPosition) {
      _fitBounds(widget.update);
    }
  }

  @override
  Widget build(BuildContext context) {
    final update = widget.update;
    final bounds = _boundsFor(update);
    final center = LatLng(
      (bounds.southwest.latitude + bounds.northeast.latitude) / 2,
      (bounds.southwest.longitude + bounds.northeast.longitude) / 2,
    );

    return GoogleMap(
      key: const ValueKey('tracking-map'),
      initialCameraPosition: CameraPosition(target: center, zoom: 14),
      style: HomeMapBackground.styleFor(widget.isDark),
      zoomControlsEnabled: false,
      mapToolbarEnabled: false,
      myLocationButtonEnabled: false,
      compassEnabled: false,
      buildingsEnabled: false,
      onMapCreated: (controller) {
        _controller = controller;
        _fitBounds(update);
      },
      markers: {
        Marker(
          markerId: const MarkerId('provider'),
          position: update.providerPosition,
          icon: BitmapDescriptor.defaultMarkerWithHue(
            BitmapDescriptor.hueAzure,
          ),
          anchor: const Offset(0.5, 0.5),
        ),
        Marker(
          markerId: const MarkerId('destination'),
          position: update.destination,
          icon: BitmapDescriptor.defaultMarkerWithHue(
            BitmapDescriptor.hueRed,
          ),
        ),
      },
      polylines: {
        Polyline(
          polylineId: const PolylineId('route'),
          points: [update.providerPosition, update.destination],
          color: Theme.of(context).colorScheme.primary,
          width: 4,
        ),
      },
    );
  }
}
