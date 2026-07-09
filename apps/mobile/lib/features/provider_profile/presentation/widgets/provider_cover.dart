import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';

/// Simulated cover banner. No real image/illustration exists yet (no
/// official branding) — a neutral placeholder box with a Material Icon
/// and the label from `ProviderProfileData.coverImages.first`.
class ProviderCover extends StatelessWidget {
  const ProviderCover({super.key, required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 120,
      width: double.infinity,
      decoration: BoxDecoration(
        color: context.colors.surface,
        borderRadius: BorderRadius.circular(AppRadius.radius12),
        border: Border.all(color: context.colors.outline),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.image_outlined,
            size: AppSpacing.space40,
            color: context.colors.secondary,
          ),
          const SizedBox(height: AppSpacing.space4),
          Text(label, style: context.textStyles.bodySmall),
        ],
      ),
    );
  }
}
