import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';

/// A single row for a simulated trust factor. Generic (only receives a
/// [label]) — reusable in any future screen that needs the same
/// icon+label row format, same spirit as `VerificationStepCard`.
class TrustFactorCard extends StatelessWidget {
  const TrustFactorCard({super.key, required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.space4),
      child: Row(
        children: [
          Icon(
            AppIcons.success,
            size: AppSpacing.space20,
            color: context.colors.primary,
          ),
          const SizedBox(width: AppSpacing.space8),
          Expanded(child: Text(label, style: context.textStyles.bodyMedium)),
        ],
      ),
    );
  }
}
