import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/address/entities/address.dart';
import 'package:mobile/category/entities/category.dart';
import 'package:mobile/features/quote/repositories/mock_quote_repository.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/quote/entities/quote.dart';
import 'package:mobile/service/entities/service.dart';

void main() {
  group('MockQuoteRepository', () {
    final repository = MockQuoteRepository();

    test('getQuote returns a real Quote entity, not a map', () async {
      expect(await repository.getQuote(), isA<Quote>());
    });

    test('getService returns a real Service entity, not a map', () async {
      expect(await repository.getService(), isA<Service>());
    });

    test('getProvider returns a real Provider entity, not a map', () async {
      expect(await repository.getProvider(), isA<Provider>());
    });

    test('getProfile returns a real Profile with a display name', () async {
      final profile = await repository.getProfile();
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getCategory returns a real Category entity, not a map', () async {
      expect(await repository.getCategory(), isA<Category>());
    });

    test('getAddress returns a real Address entity, not a map', () async {
      expect(await repository.getAddress(), isA<Address>());
    });

    test('quote and service reference the same provider id', () async {
      final providerId = (await repository.getProvider()).id;
      expect((await repository.getQuote()).providerId, equals(providerId));
      expect((await repository.getService()).providerId, equals(providerId));
    });

    test('service references the same category id', () async {
      expect(
        (await repository.getService()).categoryId,
        equals((await repository.getCategory()).id),
      );
    });

    test('is independent from every other feature mock data', () async {
      expect(
        (await repository.getProvider()).id.value.startsWith('quote-'),
        isTrue,
      );
    });
  });
}
