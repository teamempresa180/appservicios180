import 'package:flutter/material.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../mock/mock_categories_data.dart';
import '../../models/category_display.dart';
import '../../repositories/mock_category_repository.dart';
import '../widgets/categories_grid.dart';
import '../widgets/categories_header.dart';

/// Categories screen: every category, in a responsive grid. Does NOT
/// build its own `Scaffold` — it is meant to be inserted into the App
/// Shell later (see the feature README), the same way Home and
/// Marketplace already are. Completely independent of the Marketplace
/// feature: its own repository, its own mock data.
///
/// [isLoading] and [forceEmpty] only toggle which of the three visual
/// states renders (normal/loading/empty) — there is no real async
/// fetch, no state management, just a boolean switch for previewing
/// each state (see the feature README).
class CategoriesPage extends StatelessWidget {
  const CategoriesPage({
    super.key,
    this.isLoading = false,
    this.forceEmpty = false,
  });

  final bool isLoading;
  final bool forceEmpty;

  /// Composes the display list from the repository — same
  /// `_build*()` naming/placement convention every other data-driven
  /// feature's page uses (see the feature README).
  List<CategoryDisplay> _buildCategories() {
    if (forceEmpty) return const <CategoryDisplay>[];

    return [
      for (final category in MockCategoryRepository().getAll())
        CategoryDisplay(
          category: category,
          servicesCount: mockCategoryServicesCount[category.id.value] ?? 0,
        ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final categories = _buildCategories();

    return AppPageBody(
      header: const CategoriesHeader(),
      body: isLoading
          ? const AppLoading(message: 'Cargando categorías...')
          : SlideIn(child: CategoriesGrid(categories: categories)),
    );
  }
}
