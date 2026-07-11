import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_icon_row.dart';

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
    return AppIconRow(
      icon: isCompleted ? AppIcons.success : Icons.radio_button_unchecked,
      iconSize: AppSpacing.space16,
      iconColor: isCompleted
          ? context.colors.primary
          : context.colors.secondary,
      title: label,
    );
  }
}
