import '../../../address/entities/address.dart';
import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';

/// Presentation-only composition of everything a Quote screen needs.
/// Composes six real domain entities — [quote], [service], [provider],
/// [profile], [category], [address] — plus a cost breakdown that has no
/// full domain equivalent yet and an estimated date that is fully
/// simulated:
///
/// - [subtotal]: **real, not fabricated** — direct passthrough of
///   `Quote.proposedPrice`, exposed here under the name the UI spec
///   asked for. The prompt listed it as simulated, but this documents
///   it as real domain data (same judgment call as
///   `ProviderProfileData.experienceYears`) — no second, inconsistent
///   number was invented.
/// - [travelFee], [discount], [taxes]: **fully simulated** — `Quote`
///   only models a single `proposedPrice`, with no breakdown into
///   travel/discount/tax line items. No such aggregation exists yet.
/// - [total]: **derived** here (`subtotal + travelFee - discount +
///   taxes`) from the fields above — a real backend would likely
///   compute and ship this pre-aggregated instead.
/// - [estimatedTime]: **real, not fabricated** — direct passthrough of
///   `Quote.estimatedDuration` (minutes), exposed under the name the UI
///   spec asked for. Same reasoning as [subtotal].
/// - [estimatedDate]: **fully simulated** — `Quote` only has
///   `createdAt`/`updatedAt`, no estimated-delivery-date concept. Its
///   date and time components are rendered separately by
///   `ScheduleResume` ("Fecha" / "Hora").
/// - [notes]: **real, not fabricated** — direct passthrough of
///   `Quote.notes`, exposed under the name the UI spec asked for
///   ("Observaciones"). Same reasoning as [subtotal].
///
/// Nothing here is added to the domain entities themselves.
class QuoteData {
  const QuoteData({
    required this.quote,
    required this.service,
    required this.provider,
    required this.profile,
    required this.category,
    required this.address,
    required this.travelFee,
    required this.discount,
    required this.taxes,
    required this.estimatedDate,
  });

  final Quote quote;
  final Service service;
  final Provider provider;
  final Profile profile;
  final Category category;
  final Address address;

  /// Simulated — see the class doc.
  final num travelFee;

  /// Simulated — see the class doc.
  final num discount;

  /// Simulated — see the class doc.
  final num taxes;

  /// Simulated — see the class doc.
  final DateTime estimatedDate;

  /// Real domain data (`Quote.proposedPrice`) — see the class doc.
  num get subtotal => quote.proposedPrice;

  /// Derived from [subtotal]/[travelFee]/[discount]/[taxes] — see the
  /// class doc.
  num get total => subtotal + travelFee - discount + taxes;

  /// Real domain data (`Quote.estimatedDuration`, in minutes) — see the
  /// class doc.
  int get estimatedTime => quote.estimatedDuration;

  /// Real domain data (`Quote.notes`) — see the class doc.
  String get notes => quote.notes;

  String get providerName => profile.displayName;
}
