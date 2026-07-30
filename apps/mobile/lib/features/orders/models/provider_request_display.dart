import '../../../category/entities/category.dart';
import '../../../order/entities/order.dart';
import '../../../order/journey/order_journey_info.dart';
import '../../../order/journey/provider_order_journey.dart';
import '../../../order/models/order_status.dart';
import '../../../profiles/entities/profile.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';

/// Presentation-only composition of everything a provider's incoming
/// request card needs — the "Servicios" screen's equivalent of
/// `OrderDisplay`, but built around [clientProfile] (who is asking)
/// instead of the provider's own profile.
///
/// [service] is `null` for an open request with nothing assigned yet
/// (see `Order.isDirectHire`) — [category] is always present regardless
/// (`Order.categoryId`), so the card can still show what kind of work
/// is being requested even before a `Service` exists for it.
///
/// [myQuote] is this provider's own `Quote` for [order], if they've
/// already submitted one — `null` means they haven't yet, which is
/// what gates the "Enviar cotización" action (see
/// `ProviderRequestsViewModel`/`ProviderRequestCard`).
class ProviderRequestDisplay {
  const ProviderRequestDisplay({
    required this.order,
    required this.category,
    required this.clientProfile,
    this.service,
    this.myQuote,
    this.hasReviewed = false,
  });

  final Order order;
  final Category category;
  final Profile clientProfile;
  final Service? service;
  final Quote? myQuote;

  /// Whether the client already rated this (necessarily `Completed`)
  /// order — `false` for every other status, computed by
  /// `ProviderRequestsViewModel` from `ReviewsRepository.getReviews()`
  /// (same client-side-filter convention used everywhere else in this
  /// codebase). Feeds [journey] so a finished job that's still waiting
  /// on the client's rating reads differently from one that's fully
  /// done.
  final bool hasReviewed;

  /// "What's happening and what can I do" for this order, from the
  /// provider's viewpoint — the single source of truth for the title/
  /// description/help text and the exact action buttons the card
  /// should show (see `ProviderOrderJourney`, `order/journey/`).
  OrderJourneyInfo get journey => ProviderOrderJourney.derive(
    order: order,
    myQuote: myQuote,
    hasReviewed: hasReviewed,
  );

  /// `true` when the client picked this provider directly instead of
  /// posting an open request in this category — see `Order.isDirectHire`.
  bool get isDirectHire => order.isDirectHire;

  /// `true` once this provider has already submitted a `Quote` for
  /// [order] — disables re-submitting and shows a "waiting" state
  /// instead.
  bool get hasSubmittedQuote => myQuote != null;

  OrderStatus get status => order.status;

  String get clientName => clientProfile.displayName;

  DateTime get scheduledDate => order.scheduledDate;

  /// The agreed price once a `Quote` exists (own submission or, once
  /// accepted, the winning one) — `null` before that.
  num? get price => myQuote?.proposedPrice;
}
