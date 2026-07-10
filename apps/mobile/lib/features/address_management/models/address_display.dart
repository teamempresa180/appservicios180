import '../../../address/entities/address.dart';
import '../../../contact/entities/contact.dart';
import '../../../profiles/entities/profile.dart';

/// Presentation-only composition of everything an Address card needs.
/// Composes three real domain entities — [address], [profile],
/// [contact] — plus fields with no domain equivalent yet:
///
/// - [isDefault]: **fully simulated** — `Address` has no concept of a
///   "default"/"primary" address among several; no domain module
///   tracks this preference yet.
/// - [deliveryInstructions]: **fully simulated** — `Address` is a pure
///   data holder ("no geolocation, no maps, no validation, no
///   behavior" per its own class doc), with no field for delivery
///   notes.
///
/// [label] is **real, not fabricated** — direct passthrough of
/// `Address.alias` (already "Casa"/"Trabajo"/"Oficina" in the domain),
/// exposed under the name the prompt asked for. Same judgment call
/// already documented for `ProviderProfileData.experienceYears`,
/// `QuoteData.subtotal`, `OrderDisplay.scheduledDate` and
/// `PaymentDisplay.paymentMethod`: no second, fabricated label.
///
/// Nothing here is added to the domain entities themselves. No `Color`
/// or `IconData` is stored anywhere in this model — every widget
/// resolves both purely from `context.colors.*`/`Icons.*` at build
/// time.
class AddressDisplay {
  const AddressDisplay({
    required this.address,
    required this.profile,
    required this.contact,
    required this.isDefault,
    required this.deliveryInstructions,
  });

  final Address address;
  final Profile profile;
  final Contact contact;

  /// Simulated — see the class doc.
  final bool isDefault;

  /// Simulated — see the class doc.
  final String deliveryInstructions;

  /// Real domain data (`Address.alias`) — see the class doc.
  String get label => address.alias;
}
