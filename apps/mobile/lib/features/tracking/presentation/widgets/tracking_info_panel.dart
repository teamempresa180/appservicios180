import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';
import '../../models/tracking_update.dart';

/// Uber-style bottom panel over `TrackingMap`: who's on the other end
/// of the route, and the live ETA/distance/arrived status derived from
/// [update].
class TrackingInfoPanel extends StatelessWidget {
  const TrackingInfoPanel({
    super.key,
    required this.update,
    required this.otherPartyName,
    required this.otherPartyLabel,
  });

  final TrackingUpdate update;

  /// The name shown — the provider's name (client's view) or the
  /// client's name (provider's view).
  final String otherPartyName;

  /// "Tu proveedor" or "Tu cliente" — which role [otherPartyName] is.
  final String otherPartyLabel;

  String get _statusText {
    if (update.hasArrived) return 'Ha llegado al destino';
    if (update.etaMinutes <= 1) return 'Está por llegar';
    return 'Llega en ${update.etaMinutes} min';
  }

  String get _distanceText {
    if (update.hasArrived) return '';
    if (update.distanceMeters >= 1000) {
      return '${(update.distanceMeters / 1000).toStringAsFixed(1)} km';
    }
    return '${update.distanceMeters.round()} m';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.space20),
      decoration: BoxDecoration(
        color: context.colors.surface,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(AppRadius.radius24),
          topRight: Radius.circular(AppRadius.radius24),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 24,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                update.hasArrived
                    ? Icons.check_circle
                    : Icons.directions_car_filled,
                color: context.colors.primary,
              ),
              const SizedBox(width: AppSpacing.space8),
              Expanded(
                child: Text(_statusText, style: context.textStyles.titleMedium),
              ),
              if (_distanceText.isNotEmpty)
                Text(_distanceText, style: context.textStyles.bodyMedium),
            ],
          ),
          const SizedBox(height: AppSpacing.space16),
          Row(
            children: [
              const AppAvatar(radius: AppSpacing.space20),
              const SizedBox(width: AppSpacing.space12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      otherPartyLabel,
                      style: context.textStyles.bodySmall,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      otherPartyName,
                      style: context.textStyles.titleSmall,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
