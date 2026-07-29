import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';

/// One row in the order-scoped Quote list: a real `Quote` a provider
/// submitted, plus the `Provider`/`Profile` that submitted it (for
/// display — name, years of experience). Composes three real domain
/// entities — no `Map`, no `dynamic`.
class QuoteEntry {
  const QuoteEntry({
    required this.quote,
    required this.provider,
    required this.profile,
  });

  final Quote quote;
  final Provider provider;
  final Profile profile;

  String get providerName => profile.displayName;

  /// Real domain data (`Quote.proposedPrice`).
  num get price => quote.proposedPrice;

  /// Real domain data (`Quote.estimatedDuration`, in minutes).
  int get estimatedTime => quote.estimatedDuration;

  /// Real domain data (`Quote.notes`).
  String get notes => quote.notes;
}
