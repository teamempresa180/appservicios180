import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../models/review_display.dart';
import 'review_actions.dart';
import 'review_comment.dart';
import 'review_rating.dart';

/// A single review card: reviewer, rating, comment, date, service and
/// the edit-dependent action button.
class ReviewCard extends StatelessWidget {
  const ReviewCard({super.key, required this.data});

  final ReviewDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const AppAvatar(radius: AppSpacing.space16),
              const SizedBox(width: AppSpacing.space8),
              Expanded(
                child: Text(
                  data.reviewerName,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: context.textStyles.titleSmall,
                ),
              ),
              ReviewRatingStars(review: data.review),
            ],
          ),
          const SizedBox(height: AppSpacing.space8),
          ReviewComment(data: data),
          const SizedBox(height: AppSpacing.space8),
          Text(data.service.name, style: context.textStyles.bodySmall),
          const SizedBox(height: AppSpacing.space4),
          Text(data.formattedDate, style: context.textStyles.bodySmall),
          const SizedBox(height: AppSpacing.space8),
          ReviewActions(data: data),
        ],
      ),
    );
  }
}
