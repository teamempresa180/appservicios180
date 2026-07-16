import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/features/search/repositories/mock_search_repository.dart';
import 'package:mobile/service/entities/service.dart';

void main() {
  group('MockSearchRepository', () {
    final repository = MockSearchRepository();

    test('getAll returns real Service entities, not maps', () async {
      final services = await repository.getAll();

      expect(services, isA<List<Service>>());
      expect(services, everyElement(isA<Service>()));
      expect(services, isNotEmpty);
    });

    test('is independent from Marketplace/Categories mock data', () async {
      final services = await repository.getAll();
      expect(
        services.every((s) => s.id.value.startsWith('search-service-')),
        isTrue,
      );
    });
  });
}
