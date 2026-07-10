import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../mock/mock_reviews_data.dart';
import '../../models/review_display.dart';
import '../../repositories/mock_reviews_repository.dart';
import '../widgets/review_card.dart';
import '../widgets/review_filters.dart';
import '../widgets/reviews_empty_state.dart';
import '../widgets/reviews_header.dart';
import '../widgets/reviews_loading.dart';
import '../widgets/reviews_summary.dart';

/// The three purely-visual states this screen can render — same
/// fixed-`state` approach as `OrdersPage`/`PaymentsPage`/`ChatPage`/
/// `NotificationsPage`, no real async fetch, no state management.
enum ReviewsViewState { loading, empty, list }

/// Reviews screen. Does NOT build its own `Scaffold` — it is meant to
/// live within the existing navigation flow, the same way every other
/// feature so far does. Completely independent: its own repository,
/// its own mock data.
///
/// Shows a fixed list of reviews (no id-based lookup yet) — see the
/// feature README.
class ReviewsPage extends StatelessWidget {
  const ReviewsPage({super.key, this.state = ReviewsViewState.list});

  final ReviewsViewState state;

  List<ReviewDisplay> _buildReviews() {
    final repository = MockReviewsRepository();

    return [
      for (final review in repository.getReviews())
        ReviewDisplay(
          review: review,
          provider: repository.getProviderFor(review),
          profile: repository.getProfileFor(review),
          order: repository.getOrderFor(review),
          service: repository.getServiceFor(review),
          reviewerName: mockReviewerNames[review.id]!,
          isOwnReview: mockReviewIsOwn[review.id]!,
          canEdit: mockReviewCanEdit[review.id]!,
        ),
    ];
  }

  Widget _buildBody() {
    switch (state) {
      case ReviewsViewState.loading:
        return const ReviewsLoading();
      case ReviewsViewState.empty:
        return const ReviewsEmptyState();
      case ReviewsViewState.list:
        final reviews = _buildReviews();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: ReviewsSummary(reviews: reviews)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(
              child: Column(
                children: [
                  for (final review in reviews) ...[
                    ReviewCard(data: review),
                    const SizedBox(height: AppSpacing.space12),
                  ],
                ],
              ),
            ),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const FadeIn(child: ReviewsHeader()),
          const SizedBox(height: AppSpacing.space16),
          const ReviewFilters(),
          const SizedBox(height: AppSpacing.space16),
          _buildBody(),
        ],
      ),
    );
  }
}
