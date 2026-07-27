import 'package:flutter/material.dart';
import '../../../../category/entities/category.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import 'category_chip.dart';

/// Horizontally scrollable row of `Category` shortcuts — tapping one
/// filters the results list to that category (see `MarketplacePage`).
class CategoriesSection extends StatelessWidget {
  const CategoriesSection({
    super.key,
    required this.categories,
    this.selectedCategory,
    this.onCategoryTap,
  });

  final List<Category> categories;
  final Category? selectedCategory;
  final ValueChanged<Category>? onCategoryTap;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const AppSectionTitle(title: 'Categorías'),
        SizedBox(
          height: 104,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: categories.length,
            separatorBuilder: (context, index) =>
                const SizedBox(width: AppSpacing.space12),
            itemBuilder: (context, index) {
              final category = categories[index];
              return CategoryChip(
                category: category,
                selected: category.id == selectedCategory?.id,
                onTap: onCategoryTap == null
                    ? null
                    : () => onCategoryTap!(category),
              );
            },
          ),
        ),
      ],
    );
  }
}
