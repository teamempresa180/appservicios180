import '../../../address/entities/address.dart';
import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';

/// Local (on-device) source for the domain entities a Quote screen
/// needs. No implementation — see `PROJECT_STATUS.md` (Sprint 2,
/// Etapa 6).
abstract class QuoteLocalDataSource {
  Quote getQuote();
  Service getService();
  Provider getProvider();
  Profile getProfile();
  Category getCategory();
  Address getAddress();
}
