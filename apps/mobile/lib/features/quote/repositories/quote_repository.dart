import '../../../address/entities/address.dart';
import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';

/// Contract for reading the domain entities a Quote screen needs.
/// Returns only real domain entities — no `Map`, no `dynamic`.
/// Implemented today by `MockQuoteRepository`; a future
/// `ApiQuoteRepository` or `FirebaseQuoteRepository` would implement
/// this same interface (see the feature README).
///
/// There is no id-based lookup yet — this feature shows a single fixed
/// quote (see the feature README for why).
abstract class QuoteRepository {
  Future<Quote> getQuote();
  Future<Service> getService();
  Future<Provider> getProvider();
  Future<Profile> getProfile();
  Future<Category> getCategory();
  Future<Address> getAddress();
}
