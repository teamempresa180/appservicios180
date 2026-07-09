import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/features/search/repositories/mock_search_repository.dart';
import 'package:mobile/service/entities/service.dart';

void main() {
  group('MockSearchRepository', () {
    final repository = MockSearchRepository();

    test('getAll returns real Service entities, not maps', () {
      final services = repository.getAll();

      expect(services, isA<List<Service>>());
      expect(services, everyElement(isA<Service>()));
      expect(services, isNotEmpty);
    });

    test('is independent from Marketplace/Categories mock data', () {
      final services = repository.getAll();
      expect(
        services.every((s) => s.id.value.startsWith('search-service-')),
        isTrue,
      );
    });
  });
}
