import '../../../category/entities/category.dart';
import '../../../category/models/category_id.dart';
import '../../../category/models/category_status.dart';
import '../../../category/models/category_type.dart';

/// Maps the backend's `CategoryResponseDto` JSON shape (see
/// `apps/backend/.../category.response.dto.ts`) to the existing
/// `Category` domain entity — field names and enum values match 1:1,
/// only casing differs (`ACTIVE`/`STANDARD` → `active`/`standard`).
class CategoryHttpMapper {
  static Category fromJson(Map<String, dynamic> json) => Category(
    id: CategoryId.fromString(json['id'] as String),
    name: json['name'] as String,
    description: json['description'] as String,
    icon: json['icon'] as String,
    color: json['color'] as String,
    status: _statusFromJson(json['status'] as String),
    type: _typeFromJson(json['type'] as String),
    createdAt: DateTime.parse(json['createdAt'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );

  static CategoryStatus _statusFromJson(String value) =>
      CategoryStatus.values.byName(value.toLowerCase());

  static CategoryType _typeFromJson(String value) =>
      CategoryType.values.byName(value.toLowerCase());
}
