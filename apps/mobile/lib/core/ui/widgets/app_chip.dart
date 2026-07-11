import 'package:flutter/material.dart';
import '../extensions/context_theme_extensions.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';

/// Generic pill-shaped chip (see `BRANDING.md`, "Chips"). No domain
/// meaning — the caller supplies the label and whether it reads as
/// selected.
///
/// **Not wired into any feature yet** — created so the official chip
/// style exists and compiles; replacing the ad hoc chip widgets each
/// feature already has (e.g. `marketplace`'s `CategoryChip`) is
/// reserved for a later Etapa (see `BRANDING.md`).
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

    return Material(
      color: backgroundColor,
      borderRadius: BorderRadius.circular(AppRadius.radiusPill),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadius.radiusPill),
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.space12,
            vertical: AppSpacing.space8,
          ),
          child: Text(
            label,
            style: context.textStyles.labelLarge?.copyWith(color: textColor),
          ),
        ),
      ),
    );
  }
}
