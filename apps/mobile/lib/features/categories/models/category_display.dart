import '../../../category/entities/category.dart';

/// Presentation-only composition of a [Category] with the one extra
/// field a grid item needs: a simulated services count. Nothing else —
/// `Category` itself is never modified; this only wraps it. No `Map`,
/// no `dynamic`. See the feature README for why this exists.
class CategoryDisplay {
  const CategoryDisplay({required this.category, required this.servicesCount});

  final Category category;
  final int servicesCount;
}
