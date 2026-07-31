import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// Result handed back by [AddressMapPicker.show] when the user confirms
/// a pin location.
class AddressMapPickerResult {
  const AddressMapPickerResult({required this.latitude, required this.longitude});

  final double latitude;
  final double longitude;
}

/// Why the map picker couldn't center on the device's real location.
/// The map itself is never blocked by any of these — the user can
/// always pan/tap/drag the pin manually; this only drives the
/// informational banner shown above the map.
enum _LocationIssue { none, permissionDenied, serviceDisabled, unknown }

/// Full-screen "Ubicar en el mapa" picker for the address create/edit
/// flow. Shows a `GoogleMap` centered on the device's current location
/// (same `geolocator` request/permission pattern as `HomeMapBackground`)
/// with a draggable, tappable marker the user moves to pin the exact
/// address location.
///
/// Pushed as its own route (via [show]) rather than embedded inline in
/// `AddressFormSheet` — keeps the map out of the form's scroll view
/// entirely (no overflow/height-fighting concerns) and means the form's
/// own widget tests never build a real `GoogleMap` platform view unless
/// a test explicitly taps through to this screen.
///
/// Robust against the three real-world conditions this feature must
/// survive without ever blocking the address form itself:
/// - **Permission denied**: shows a banner explaining location access
///   was denied and lets the user drop the pin manually by panning/
///   tapping the map, which still starts centered on a sensible
///   default (Bogotá centro, same default as `HomeMapBackground`).
/// - **GPS/location services disabled**: same banner variant, same
///   manual-pin fallback.
/// - **Unexpected failure locating the device** (e.g. platform channel
///   error): caught, surfaces a retry affordance instead of crashing.
class AddressMapPicker extends StatefulWidget {
  const AddressMapPicker({super.key, this.initialLatitude, this.initialLongitude});

  final double? initialLatitude;
  final double? initialLongitude;

  static const CameraPosition _fallbackCamera = CameraPosition(
    target: LatLng(4.7110, -74.0721), // Bogotá centro, same default as HomeMapBackground.
    zoom: 15,
  );

  /// Pushes the picker as a full-screen route and returns the confirmed
  /// pin, or `null` if the user backed out without confirming.
  static Future<AddressMapPickerResult?> show(
    BuildContext context, {
    double? initialLatitude,
    double? initialLongitude,
  }) {
    return Navigator.of(context).push<AddressMapPickerResult>(
      MaterialPageRoute(
        builder: (context) => AddressMapPicker(
          initialLatitude: initialLatitude,
          initialLongitude: initialLongitude,
        ),
      ),
    );
  }

  @override
  State<AddressMapPicker> createState() => _AddressMapPickerState();
}

class _AddressMapPickerState extends State<AddressMapPicker> {
  late LatLng _pin = widget.initialLatitude != null && widget.initialLongitude != null
      ? LatLng(widget.initialLatitude!, widget.initialLongitude!)
      : AddressMapPicker._fallbackCamera.target;
  late CameraPosition _initialCamera = CameraPosition(target: _pin, zoom: 16);

  bool _locating = true;
  _LocationIssue _issue = _LocationIssue.none;
  GoogleMapController? _controller;

  @override
  void initState() {
    super.initState();
    // Only auto-center on the device's real location when the caller
    // didn't already pass an existing pin (edit flow) — creating a new
    // address should default to "where the user is right now".
    if (widget.initialLatitude == null || widget.initialLongitude == null) {
      _locateDevice();
    } else {
      _locating = false;
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  Future<void> _locateDevice() async {
    setState(() {
      _locating = true;
      _issue = _LocationIssue.none;
    });
    try {
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        if (!mounted) return;
        setState(() {
          _locating = false;
          _issue = _LocationIssue.serviceDisabled;
        });
        return;
      }

      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        if (!mounted) return;
        setState(() {
          _locating = false;
          _issue = _LocationIssue.permissionDenied;
        });
        return;
      }

      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 10),
        ),
      );
      if (!mounted) return;
      final target = LatLng(position.latitude, position.longitude);
      setState(() {
        _pin = target;
        _initialCamera = CameraPosition(target: target, zoom: 16);
        _locating = false;
        _issue = _LocationIssue.none;
      });
      await _controller?.animateCamera(CameraUpdate.newLatLng(target));
    } catch (_) {
      // Platform channel/timeout failure — never crash the picker, just
      // fall back to letting the user place the pin manually.
      if (!mounted) return;
      setState(() {
        _locating = false;
        _issue = _LocationIssue.unknown;
      });
    }
  }

  void _movePin(LatLng target) {
    setState(() => _pin = target);
  }

  void _confirm() {
    Navigator.of(context).pop(
      AddressMapPickerResult(latitude: _pin.latitude, longitude: _pin.longitude),
    );
  }

  String? get _bannerMessage {
    switch (_issue) {
      case _LocationIssue.permissionDenied:
        return 'No autorizaste el acceso a tu ubicación. Puedes mover el pin manualmente para marcar la dirección.';
      case _LocationIssue.serviceDisabled:
        return 'El GPS está desactivado. Puedes mover el pin manualmente para marcar la dirección.';
      case _LocationIssue.unknown:
        return 'No pudimos obtener tu ubicación actual. Puedes mover el pin manualmente o reintentar.';
      case _LocationIssue.none:
        return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final banner = _bannerMessage;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Ubicar en el mapa'),
        actions: [
          IconButton(
            icon: const Icon(Icons.my_location),
            tooltip: 'Usar mi ubicación actual',
            onPressed: _locating ? null : _locateDevice,
          ),
        ],
      ),
      body: Stack(
        children: [
          Positioned.fill(
            child: GoogleMap(
              key: const ValueKey('address-map-picker'),
              initialCameraPosition: _initialCamera,
              onMapCreated: (controller) => _controller = controller,
              onTap: _movePin,
              zoomControlsEnabled: false,
              mapToolbarEnabled: false,
              myLocationButtonEnabled: false,
              compassEnabled: false,
              markers: {
                Marker(
                  markerId: const MarkerId('address-pin'),
                  position: _pin,
                  draggable: true,
                  onDragEnd: _movePin,
                ),
              },
            ),
          ),
          if (_locating)
            const Positioned(
              top: AppSpacing.space16,
              left: AppSpacing.space16,
              right: AppSpacing.space16,
              child: _MapPickerBanner(
                icon: Icons.my_location,
                message: 'Ubicando tu posición actual…',
                showProgress: true,
              ),
            ),
          if (!_locating && banner != null)
            Positioned(
              top: AppSpacing.space16,
              left: AppSpacing.space16,
              right: AppSpacing.space16,
              child: _MapPickerBanner(
                icon: Icons.info_outline,
                message: banner,
                onRetry: _issue == _LocationIssue.unknown ? _locateDevice : null,
              ),
            ),
          Positioned(
            left: AppSpacing.space16,
            right: AppSpacing.space16,
            bottom: AppSpacing.space16,
            child: SafeArea(
              top: false,
              child: Container(
                padding: const EdgeInsets.all(AppSpacing.space16),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surface,
                  borderRadius: BorderRadius.circular(AppRadius.radius16),
                  boxShadow: [
                    BoxShadow(
                      color: theme.colorScheme.shadow.withValues(alpha: 0.15),
                      blurRadius: AppSpacing.space12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      'Arrastra o toca el mapa para ajustar el punto exacto.',
                      style: theme.textTheme.bodySmall,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: AppSpacing.space12),
                    AppButton(label: 'Confirmar ubicación', onPressed: _confirm),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MapPickerBanner extends StatelessWidget {
  const _MapPickerBanner({
    required this.icon,
    required this.message,
    this.showProgress = false,
    this.onRetry,
  });

  final IconData icon;
  final String message;
  final bool showProgress;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Material(
      color: theme.colorScheme.surface,
      borderRadius: BorderRadius.circular(AppRadius.radius12),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.space12,
          vertical: AppSpacing.space8,
        ),
        child: Row(
          children: [
            if (showProgress)
              const SizedBox(
                width: AppSpacing.space16,
                height: AppSpacing.space16,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            else
              Icon(icon, size: AppSpacing.space20, color: theme.colorScheme.secondary),
            const SizedBox(width: AppSpacing.space8),
            Expanded(
              child: Text(message, style: theme.textTheme.bodySmall),
            ),
            if (onRetry != null)
              TextButton(onPressed: onRetry, child: const Text('Reintentar')),
          ],
        ),
      ),
    );
  }
}
