import '../../../category/entities/category.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';

/// Presentation-only composition of everything a provider's incoming
/// request card needs — the "Servicios" screen's equivalent of
/// `OrderDisplay`, but built around [clientProfile] (who is asking)
/// instead of the provider's own profile.
class ProviderRequestDisplay {
  const ProviderRequestDisplay({
    required this.order,
    required this.service,
    required this.category,
    required this.quote,
    required this.clientProfile,
  });

  final Order order;
  final Service service;
  final Category category;
  final Quote quote;
  final Profile clientProfile;

  String get clientName => clientProfile.displayName;
  DateTime get scheduledDate => order.scheduledDate;
  num get price => quote.proposedPrice;
}
