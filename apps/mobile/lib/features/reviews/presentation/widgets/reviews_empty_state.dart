import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Reviews screen. Reuses
/// `AppEmptyState` — no new Core UI widget.
class ReviewsEmptyState extends StatelessWidget {
  const ReviewsEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin reseñas todavía',
      description: 'Cuando califiques un servicio, tus reseñas '
          'aparecerán aquí.',
      icon: Icons.rate_review_outlined,
    );
  }
}
