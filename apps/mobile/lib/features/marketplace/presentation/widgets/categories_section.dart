import 'package:flutter/material.dart';
import '../../../../category/entities/category.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import 'category_chip.dart';

/// Horizontally scrollable row of `Category` shortcuts. Purely visual —
/// tapping a category does nothing yet (see the feature README).
class CategoriesSection extends StatelessWidget {
  const CategoriesSection({super.key, required this.categories});

  final List<Category> categories;

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
            itemBuilder: (context, index) =>
                CategoryChip(category: categories[index]),
          ),
        ),
      ],
    );
  }
}
