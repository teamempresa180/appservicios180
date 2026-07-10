import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/review_display.dart';

/// Aggregate rating + review count for the whole list. The average is
/// **derived** here from the real `Review.rating` of every
/// `ReviewDisplay` passed in — same approach already used by
/// `ProviderProfileData.rating`/`ServiceDetailData.rating`.
class ReviewsSummary extends StatelessWidget {
  const ReviewsSummary({super.key, required this.reviews});

  final List<ReviewDisplay> reviews;

  @override
  Widget build(BuildContext context) {
    final average = reviews.isEmpty
        ? 0.0
        : reviews.map((r) => r.review.rating.value).reduce((a, b) => a + b) /
              reviews.length;

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Resumen'),
          Row(
            children: [
              Icon(Icons.star, color: context.colors.primary),
              const SizedBox(width: AppSpacing.space8),
              Text(
                average.toStringAsFixed(1),
                style: context.textStyles.titleMedium,
              ),
              const SizedBox(width: AppSpacing.space8),
              Text(
                '(${reviews.length} reseñas)',
                style: context.textStyles.bodySmall,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
