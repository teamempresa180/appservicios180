import '../../../address/entities/address.dart';
import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';
import '../mock/mock_quote_data.dart';
import 'quote_repository.dart';

/// In-memory `QuoteRepository` backed by fixed mock data. No backend,
/// no persistence, no network — see the feature README.
class MockQuoteRepository implements QuoteRepository {
  @override
  Future<Quote> getQuote() => Future.value(mockQuote);

  @override
  Future<Service> getService() => Future.value(mockQuoteService);

  @override
  Future<Provider> getProvider() => Future.value(mockQuoteProvider);

  @override
  Future<Profile> getProfile() => Future.value(mockQuoteProfile);

  @override
  Future<Category> getCategory() => Future.value(mockQuoteCategory);

  @override
  Future<Address> getAddress() => Future.value(mockQuoteAddress);
}
