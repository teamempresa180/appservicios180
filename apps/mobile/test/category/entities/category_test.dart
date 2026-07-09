import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/category/entities/category.dart';
import 'package:mobile/category/models/category_id.dart';
import 'package:mobile/category/models/category_status.dart';
import 'package:mobile/category/models/category_type.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = CategoryId.create();
    final now = DateTime(2026, 1, 1);
    final category = Category(
      id: id,
      name: 'Plomería',
      description: 'Servicios de plomería residencial y comercial',
      icon: 'plumbing_icon',
      color: '#2196F3',
      status: CategoryStatus.active,
      type: CategoryType.standard,
      createdAt: now,
      updatedAt: now,
    );

    expect(category.id, id);
    expect(category.name, 'Plomería');
    expect(category.icon, 'plumbing_icon');
    expect(category.color, '#2196F3');
    expect(category.status, CategoryStatus.active);
    expect(category.type, CategoryType.standard);
  });

  test('is equal to another category with the same id', () {
    final id = CategoryId.create();
    final now = DateTime(2026, 1, 1);
    Category build() => Category(
      id: id,
      name: 'Plomería',
      description: 'Desc',
      icon: 'icon',
      color: '#000000',
      status: CategoryStatus.active,
      type: CategoryType.standard,
      createdAt: now,
      updatedAt: now,
    );

    expect(build(), equals(build()));
  });
}
