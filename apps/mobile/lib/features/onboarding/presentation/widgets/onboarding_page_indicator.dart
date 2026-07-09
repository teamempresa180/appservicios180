import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';

/// Row of dots indicating the current page within the Onboarding flow.
/// Purely presentational — colors come from the active theme, not from any
/// brand palette.
class OnboardingPageIndicator extends StatelessWidget {
  const OnboardingPageIndicator({
    super.key,
    required this.pageCount,
    required this.currentPage,
  });

  final int pageCount;
  final int currentPage;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(pageCount, (index) {
        final isActive = index == currentPage;
        return AnimatedContainer(
          duration: AppDurations.fast,
          margin: const EdgeInsets.symmetric(horizontal: AppSpacing.space4),
          width: isActive ? AppSpacing.space24 : AppSpacing.space8,
          height: AppSpacing.space8,
          decoration: BoxDecoration(
            color: isActive ? context.colors.primary : context.colors.outline,
            borderRadius: BorderRadius.circular(AppRadius.radius4),
          ),
        );
      }),
    );
  }
}
