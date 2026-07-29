import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/review_display.dart';

/// The review's title + comment. Real domain data
/// (`Review.title`/`Review.comment`) — see `ReviewDisplay` and the
/// feature README.
class ReviewComment extends StatelessWidget {
  const ReviewComment({super.key, required this.data});

  final ReviewDisplay data;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          data.review.title,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: context.textStyles.titleSmall,
        ),
        const SizedBox(height: AppSpacing.space4),
        Text(data.review.comment, style: context.textStyles.bodyMedium),
      ],
    );
  }
}
