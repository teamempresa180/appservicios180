import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../models/onboarding_slide.dart';

/// Renders a single [OnboardingSlide]: icon, title and description, reusing
/// the existing Design System only. No branding, no custom assets.
class OnboardingSlideView extends StatelessWidget {
  const OnboardingSlideView({super.key, required this.slide});

  final OnboardingSlide slide;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SingleChildScrollView(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 480),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.space16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ScaleIn(
                  child: AppCard(
                    child: Icon(
                      slide.icon,
                      size: AppSpacing.space64,
                      color: context.colors.primary,
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.space24),
                FadeIn(child: AppSectionTitle(title: slide.title)),
                const SizedBox(height: AppSpacing.space8),
                FadeIn(
                  delay: const Duration(milliseconds: 100),
                  child: Text(
                    slide.description,
                    textAlign: TextAlign.center,
                    style: context.textStyles.bodyMedium,
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
