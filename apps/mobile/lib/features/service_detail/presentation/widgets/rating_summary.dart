import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_divider.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/service_detail_data.dart';

/// Rating summary: aggregate rating + reviews count, followed by each
/// individual (mock) review's title and comment.
class RatingSummary extends StatelessWidget {
  const RatingSummary({super.key, required this.data});

  final ServiceDetailData data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppSectionTitle(
            title: 'Calificación',
            subtitle: '${data.reviewsCount} reseñas',
          ),
          Row(
            children: [
              Icon(Icons.star_outline, color: context.colors.primary),
              const SizedBox(width: AppSpacing.space4),
              Text(
                data.rating.toStringAsFixed(1),
                style: context.textStyles.titleMedium,
              ),
            ],
          ),
          if (data.reviews.isNotEmpty) ...[
            const AppDivider(),
            for (final review in data.reviews) ...[
              Text(review.title, style: context.textStyles.titleSmall),
              const SizedBox(height: AppSpacing.space4),
              Text(review.comment, style: context.textStyles.bodySmall),
              const SizedBox(height: AppSpacing.space12),
            ],
          ],
        ],
      ),
    );
  }
}
