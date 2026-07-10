import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';

/// A single verification step row. `isCompleted` reflects whether this
/// label came from the **simulated** `completedSteps` or
/// `pendingSteps` list — see `VerificationDisplay` and the feature
/// README. No color/icon stored anywhere — resolved from
/// `context.colors.*` here.
class VerificationStepCard extends StatelessWidget {
  const VerificationStepCard({
    super.key,
    required this.label,
    required this.isCompleted,
  });

  final String label;
  final bool isCompleted;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.space4),
      child: Row(
        children: [
          Icon(
            isCompleted
                ? Icons.check_circle_outline
                : Icons.radio_button_unchecked,
            size: AppSpacing.space16,
            color: isCompleted
                ? context.colors.primary
                : context.colors.secondary,
          ),
          const SizedBox(width: AppSpacing.space8),
          Expanded(child: Text(label, style: context.textStyles.bodyMedium)),
        ],
      ),
    );
  }
}
