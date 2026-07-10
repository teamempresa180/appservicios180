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
  Quote getQuote() => mockQuote;

  @override
  Service getService() => mockQuoteService;

  @override
  Provider getProvider() => mockQuoteProvider;

  @override
  Profile getProfile() => mockQuoteProfile;

  @override
  Category getCategory() => mockQuoteCategory;

  @override
  Address getAddress() => mockQuoteAddress;
}
