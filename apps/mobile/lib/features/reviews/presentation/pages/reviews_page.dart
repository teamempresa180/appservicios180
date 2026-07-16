import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../repositories/reviews_repository.dart';
import '../view_models/reviews_view_model.dart';
import '../widgets/review_card.dart';
import '../widgets/review_filters.dart';
import '../widgets/reviews_empty_state.dart';
import '../widgets/reviews_header.dart';
import '../widgets/reviews_loading.dart';
import '../widgets/reviews_summary.dart';

/// Reviews screen. Does NOT build its own `Scaffold` — it is meant to
/// live within the existing navigation flow, the same way every other
/// feature so far does. Completely independent: its own repository,
/// its own view model, loaded from the real backend via
/// [ReviewsViewModel] (resolved from the service locator — see
/// `core/di/service_locator.dart`).
///
/// Shows a fixed list of reviews (no id-based lookup yet) — see the
/// feature README.
class ReviewsPage extends StatefulWidget {
  const ReviewsPage({super.key, ReviewsRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final ReviewsRepository? _repository;

  @override
  State<ReviewsPage> createState() => _ReviewsPageState();
}

class _ReviewsPageState extends State<ReviewsPage> {
  late final ReviewsViewModel _viewModel = ReviewsViewModel(
    widget._repository ?? locator<ReviewsRepository>(),
  );

  @override
  void initState() {
    super.initState();
    _viewModel.load();
    _viewModel.addListener(_onViewModelChanged);
  }

  void _onViewModelChanged() => setState(() {});

  @override
  void dispose() {
    _viewModel.removeListener(_onViewModelChanged);
    _viewModel.dispose();
    super.dispose();
  }

  Widget _buildBody() {
    switch (_viewModel.status) {
      case ReviewsLoadStatus.loading:
        return const ReviewsLoading();
      case ReviewsLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudieron cargar las reseñas',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case ReviewsLoadStatus.success:
        final reviews = _viewModel.reviews;
        if (reviews.isEmpty) {
          return const ReviewsEmptyState();
        }
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: ReviewsSummary(reviews: reviews)),
            const SizedBox(height: AppSpacing.space16),
            Column(
              children: [
                for (final (index, review) in reviews.indexed) ...[
                  FadeIn(
                    delay: staggerDelayFor(index),
                    child: SlideIn(child: ReviewCard(data: review)),
                  ),
                  const SizedBox(height: AppSpacing.space12),
                ],
              ],
            ),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(
      header: const ReviewsHeader(),
      toolbar: const [ReviewFilters()],
      body: _buildBody(),
    );
  }
}
