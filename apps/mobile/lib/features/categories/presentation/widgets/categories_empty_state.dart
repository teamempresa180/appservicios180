import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for when no categories are available.
/// Reuses `AppEmptyState` — no new Core UI widget, no retry logic.
class CategoriesEmptyState extends StatelessWidget {
  const CategoriesEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin categorías disponibles',
      description: 'Vuelve a intentarlo más tarde.',
      icon: Icons.category_outlined,
    );
  }
}
