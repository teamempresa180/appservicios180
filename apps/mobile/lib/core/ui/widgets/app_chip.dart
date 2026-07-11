import 'package:flutter/material.dart';
import '../extensions/context_theme_extensions.dart';
import '../tokens/app_durations.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';

/// Generic pill-shaped chip (see `BRANDING.md`, "Chips"). No domain
/// meaning — the caller supplies the label and whether it reads as
/// selected.
///
/// [selected] renders with a stronger container color, a thin border
/// and a small leading check icon (Sprint 2, Etapa 5) so the selected
/// state reads clearly at a glance — not just a subtle color shift.
class AppChip extends StatelessWidget {
  const AppChip({
    super.key,
    required this.label,
    this.selected = false,
    this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final backgroundColor = selected
        ? context.colors.primaryContainer
        : context.colors.secondaryContainer;
    final textColor = selected
        ? context.colors.onPrimaryContainer
        : context.colors.onSecondaryContainer;
    final borderColor = selected ? context.colors.primary : Colors.transparent;

    return AnimatedContainer(
      duration: AppDurations.fast,
      curve: Curves.easeOut,
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(AppRadius.radiusPill),
        border: Border.all(color: borderColor, width: 1.5),
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(AppRadius.radiusPill),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(AppRadius.radiusPill),
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.space12,
              vertical: AppSpacing.space8,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                AnimatedSwitcher(
                  duration: AppDurations.fast,
                  child: selected
                      ? Padding(
                          key: const ValueKey('selected-icon'),
                          padding: const EdgeInsets.only(
                            right: AppSpacing.space4,
                          ),
                          child: Icon(
                            Icons.check,
                            size: AppSpacing.space16,
                            color: textColor,
                          ),
                        )
                      : const SizedBox.shrink(key: ValueKey('no-icon')),
                ),
                Flexible(
                  child: Text(
                    label,
                    overflow: TextOverflow.ellipsis,
                    style: context.textStyles.labelLarge?.copyWith(
                      color: textColor,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
