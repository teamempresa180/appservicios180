import 'package:flutter/material.dart';
import '../extensions/context_theme_extensions.dart';
import '../theme/app_brand_palette.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';

/// The five semantic tones an `AppBadge` can render as. No domain
/// meaning — the caller decides which tone fits (e.g. `neutral` for a
/// plain count, `error` for an alert count).
enum AppBadgeTone { neutral, info, success, warning, error }

/// Generic small pill for a status label or a count. No domain meaning
/// — the caller supplies the text and either picks a [tone] or, when a
/// status color must be derived from a domain enum the way
/// `OrderStatusBadge`/`PaymentStatusBadge`/`ServiceStatusBadge` do
/// (switching on `OrderStatus`/`PaymentStatus`/`ServiceStatus`, entities
/// this widget must never import), passes that already-resolved
/// [color] directly — the domain-aware `switch` stays in the feature
/// widget, only the pill rendering is shared here.
class AppBadge extends StatelessWidget {
  const AppBadge({
    super.key,
    required this.label,
    this.tone = AppBadgeTone.neutral,
    this.color,
  });

  final String label;
  final AppBadgeTone tone;

  /// Overrides [tone]'s color when set — see the class doc.
  final Color? color;

  Color _colorFor(AppBadgeTone tone) {
    switch (tone) {
      case AppBadgeTone.neutral:
        return AppBrandPalette.secondary500;
      case AppBadgeTone.info:
        return AppBrandPalette.info500;
      case AppBadgeTone.success:
        return AppBrandPalette.success500;
      case AppBadgeTone.warning:
        return AppBrandPalette.warning500;
      case AppBadgeTone.error:
        return AppBrandPalette.error500;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = this.color ?? _colorFor(tone);

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space12,
        vertical: AppSpacing.space4,
      ),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(AppRadius.radiusPill),
      ),
      child: Text(
        label,
        style: context.textStyles.labelMedium?.copyWith(
          color: color,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
