import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/entities/category.dart';
import 'package:mobile/features/categories/repositories/mock_category_repository.dart';

void main() {
  group('MockCategoryRepository', () {
    final repository = MockCategoryRepository();

    test('getAll returns real Category entities, not maps', () {
      final categories = repository.getAll();

      expect(categories, isA<List<Category>>());
      expect(categories, everyElement(isA<Category>()));
      expect(categories.length, 12);
      expect(categories.map((c) => c.name), contains('Plomería'));
      expect(categories.map((c) => c.name), contains('Climatización'));
    });

    test('is independent from the Marketplace mock data', () {
      final categories = repository.getAll();
      expect(
        categories.every((c) => c.id.value.startsWith('categories-')),
        isTrue,
      );
    });
  });
}
