import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/features/quote/mock/mock_quote_data.dart';
import 'package:mobile/features/quote/repositories/mock_quote_repository.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/quote/models/quote_status.dart';

void main() {
  group('MockQuoteRepository', () {
    late MockQuoteRepository repository;

    setUp(() => repository = MockQuoteRepository());

    test('getQuotesForOrder returns every real Quote for that order', () async {
      final quotes = await repository.getQuotesForOrder(mockQuoteOrderId);
      expect(quotes, isNotEmpty);
      expect(
        quotes.every((quote) => quote.orderId == mockQuoteOrderId),
        isTrue,
      );
    });

    test('returns more than one quote for an order with multiple providers', () async {
      final quotes = await repository.getQuotesForOrder(mockQuoteOrderId);
      expect(quotes.length, greaterThan(1));
    });

    test('getProviderFor returns a real Provider entity, not a map', () async {
      final quotes = await repository.getQuotesForOrder(mockQuoteOrderId);
      final provider = await repository.getProviderFor(quotes.first);
      expect(provider, isA<Provider>());
    });

    test('getProfileFor returns a real Profile with a display name', () async {
      final quotes = await repository.getQuotesForOrder(mockQuoteOrderId);
      final profile = await repository.getProfileFor(quotes.first);
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('acceptQuote transitions the quote to accepted', () async {
      final quotes = await repository.getQuotesForOrder(mockQuoteOrderId);
      final accepted = await repository.acceptQuote(quotes.first);
      expect(accepted.status, QuoteStatus.accepted);
    });

    test('rejectQuote transitions the quote to rejected', () async {
      final quotes = await repository.getQuotesForOrder(mockQuoteOrderId);
      final rejected = await repository.rejectQuote(quotes.last);
      expect(rejected.status, QuoteStatus.rejected);
    });
  });
}
