import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/session/provider_availability_controller.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/theme/app_brand_palette.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';

/// Compact "Disponible"/"Ocupado" segmented toggle, shown below the
/// greeting in `HomeHeader` for the provider role only — a quick status
/// flip, independent of the detailed weekly schedule
/// (`AvailabilityPage`, reached from Provider Dashboard). Reactive via
/// [ProviderAvailabilityController].
class AvailabilityToggle extends StatelessWidget {
  const AvailabilityToggle({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = locator<ProviderAvailabilityController>();
    return ListenableBuilder(
      listenable: controller,
      builder: (context, _) {
        final isAvailable = controller.isAvailable;
        return Container(
          padding: const EdgeInsets.all(AppSpacing.space4),
          decoration: BoxDecoration(
            color: context.colors.surfaceContainerHighest,
            borderRadius: BorderRadius.circular(AppRadius.radiusPill),
          ),
          child: Row(
            children: [
              Expanded(
                child: _Segment(
                  label: 'Disponible',
                  icon: Icons.check_circle,
                  color: AppBrandPalette.success500,
                  selected: isAvailable,
                  onTap: () => controller.setAvailable(true),
                ),
              ),
              Expanded(
                child: _Segment(
                  label: 'Ocupado',
                  icon: Icons.do_not_disturb_on,
                  color: AppBrandPalette.warning500,
                  selected: !isAvailable,
                  onTap: () => controller.setAvailable(false),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _Segment extends StatelessWidget {
  const _Segment({
    required this.label,
    required this.icon,
    required this.color,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final Color color;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? color.withValues(alpha: 0.16) : Colors.transparent,
      borderRadius: BorderRadius.circular(AppRadius.radiusPill),
      child: InkWell(
        borderRadius: BorderRadius.circular(AppRadius.radiusPill),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: AppSpacing.space8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: AppSpacing.space16, color: selected ? color : context.colors.onSurfaceVariant),
              const SizedBox(width: AppSpacing.space4),
              Text(
                label,
                style: context.textStyles.labelMedium?.copyWith(
                  color: selected ? color : context.colors.onSurfaceVariant,
                  fontWeight: selected ? FontWeight.w700 : FontWeight.w400,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
