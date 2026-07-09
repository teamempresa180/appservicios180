import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/category_display.dart';
import 'categories_empty_state.dart';
import 'category_grid_item.dart';

/// Responsive grid of `CategoryDisplay` tiles. Shows
/// [CategoriesEmptyState] when [categories] is empty. Column count
/// grows with the available width (mobile → tablet → desktop) so tiles
/// never get too cramped or too stretched.
class CategoriesGrid extends StatelessWidget {
  const CategoriesGrid({super.key, required this.categories});

  final List<CategoryDisplay> categories;

  int _crossAxisCountFor(double width) {
    if (width >= 900) return 4;
    if (width >= 600) return 3;
    return 2;
  }

  @override
  Widget build(BuildContext context) {
    if (categories.isEmpty) return const CategoriesEmptyState();

    return LayoutBuilder(
      builder: (context, constraints) {
        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: _crossAxisCountFor(constraints.maxWidth),
            crossAxisSpacing: AppSpacing.space12,
            mainAxisSpacing: AppSpacing.space12,
            childAspectRatio: 0.9,
          ),
          itemCount: categories.length,
          itemBuilder: (context, index) =>
              CategoryGridItem(display: categories[index]),
        );
      },
    );
  }
}
