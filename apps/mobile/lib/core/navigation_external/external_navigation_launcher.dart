import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../ui/extensions/context_theme_extensions.dart';
import '../ui/tokens/app_spacing.dart';
import '../ui/widgets/app_bottom_sheet.dart';

/// The two turn-by-turn navigation apps [ExternalNavigationLauncher]
/// can hand a destination off to.
enum ExternalNavigationApp { googleMaps, waze }

/// Opens Google Maps/Waze with driving directions to a destination
/// address, for the Provider's "Iniciar navegación" action (Etapa 12).
///
/// There is no lat/lng anywhere in this domain — `Address` only carries
/// free-text fields ([Address.fullAddress]/`.city`/`.state`/`.country`)
/// — so this relies on Google Maps'/Waze's own address-text geocoding,
/// which both apps (and their web fallbacks) support natively via URL.
/// No live location tracking is involved: both URLs simply open
/// turn-by-turn directions in the external app, which uses the
/// device's current location as the origin on its own.
abstract final class ExternalNavigationLauncher {
  /// Shows a chooser (Google Maps vs Waze) and, once the user picks
  /// one, launches it with directions to [destinationAddress].
  ///
  /// Returns `true` once a navigation app (or a browser fallback) was
  /// launched, `false` if the user dismissed the chooser without
  /// picking one or if launching failed (neither app installed and no
  /// browser available to open the URL either). Never throws.
  static Future<bool> start(
    BuildContext context, {
    required String destinationAddress,
  }) async {
    final chosen = await _NavigationAppSheet.show(context);
    if (chosen == null) return false;

    final encoded = Uri.encodeComponent(destinationAddress);
    final uri = switch (chosen) {
      ExternalNavigationApp.googleMaps => Uri.parse(
        'https://www.google.com/maps/dir/?api=1&destination=$encoded&travelmode=driving',
      ),
      ExternalNavigationApp.waze => Uri.parse(
        'https://waze.com/ul?q=$encoded&navigate=yes',
      ),
    };

    try {
      return await launchUrl(uri, mode: LaunchMode.externalApplication);
    } catch (_) {
      return false;
    }
  }
}

/// Bottom sheet letting the provider choose which navigation app to
/// open — same shape/convention as `ImageSourceSheet`.
class _NavigationAppSheet extends StatelessWidget {
  const _NavigationAppSheet();

  static Future<ExternalNavigationApp?> show(BuildContext context) {
    return AppBottomSheet.show<ExternalNavigationApp>(
      context,
      child: const _NavigationAppSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Iniciar navegación', style: context.textStyles.titleMedium),
        const SizedBox(height: AppSpacing.space12),
        ListTile(
          leading: Icon(Icons.map_outlined, color: context.colors.primary),
          title: const Text('Google Maps'),
          onTap: () =>
              Navigator.of(context).pop(ExternalNavigationApp.googleMaps),
        ),
        ListTile(
          leading: Icon(
            Icons.navigation_outlined,
            color: context.colors.primary,
          ),
          title: const Text('Waze'),
          onTap: () => Navigator.of(context).pop(ExternalNavigationApp.waze),
        ),
      ],
    );
  }
}
