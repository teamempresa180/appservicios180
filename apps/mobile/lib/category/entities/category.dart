import '../../core/base/entity.dart';
import '../models/category_id.dart';
import '../models/category_status.dart';
import '../models/category_type.dart';

/// Represents a service category. Pure data holder — no hierarchy, no
/// providers, no services, no search, no behavior, no persistence.
class Category extends Entity<CategoryId> {
  const Category({
    required CategoryId id,
    required this.name,
    required this.description,
    required this.icon,
    required this.color,
    required this.status,
    required this.type,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final String name;
  final String description;
  final String icon;
  final String color;
  final CategoryStatus status;
  final CategoryType type;
  final DateTime createdAt;
  final DateTime updatedAt;
}
