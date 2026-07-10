import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../review/entities/review.dart';

/// Star rating for a real `Review.rating`. **No color or icon is
/// stored anywhere** — every star `Icon` and its color are resolved
/// here, purely from `context.colors.*`, at build time.
class ReviewRatingStars extends StatelessWidget {
  const ReviewRatingStars({super.key, required this.review});

  final Review review;

  @override
  Widget build(BuildContext context) {
    final rating = review.rating.value.round();

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (var i = 1; i <= 5; i++)
          Icon(
            i <= rating ? Icons.star : Icons.star_border,
            size: AppSpacing.space16,
            color: context.colors.primary,
          ),
      ],
    );
  }
}
