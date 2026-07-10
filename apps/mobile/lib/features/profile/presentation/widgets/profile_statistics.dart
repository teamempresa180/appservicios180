import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/profile_display.dart';

/// Profile completion progress. `completionPercentage`/
/// `profileCompletionItems` are **simulated** — see `ProfileDisplay`
/// and the feature README. No color is hardcoded — `LinearProgressIndicator`
/// picks up `context.colors.primary` from the theme by default.
class ProfileStatistics extends StatelessWidget {
  const ProfileStatistics({super.key, required this.data});

  final ProfileDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Progreso del perfil'),
          Row(
            children: [
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(AppSpacing.space4),
                  child: LinearProgressIndicator(
                    value: data.completionPercentage / 100,
                    minHeight: AppSpacing.space8,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.space8),
              Text(
                '${data.completionPercentage}%',
                style: context.textStyles.titleSmall,
              ),
            ],
          ),
          if (data.profileCompletionItems.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.space12),
            for (final item in data.profileCompletionItems)
              Padding(
                padding: const EdgeInsets.symmetric(
                  vertical: AppSpacing.space4,
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.radio_button_unchecked,
                      size: AppSpacing.space16,
                      color: context.colors.secondary,
                    ),
                    const SizedBox(width: AppSpacing.space8),
                    Expanded(
                      child: Text(item, style: context.textStyles.bodySmall),
                    ),
                  ],
                ),
              ),
          ],
        ],
      ),
    );
  }
}
