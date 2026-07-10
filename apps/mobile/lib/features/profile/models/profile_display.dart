import '../../../address/entities/address.dart';
import '../../../contact/entities/contact.dart';
import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';

/// Presentation-only composition of everything a Profile screen needs.
/// Composes four real domain entities — [profile], [identity],
/// [contacts], [address] — plus fields with no domain equivalent yet:
///
/// - [completionPercentage], [profileCompletionItems]: **fully
///   simulated** — no domain module computes "profile completeness";
///   these are plain placeholder numbers/labels.
///
/// [memberSince] is **derived**, not simulated — computed from the
/// real `Identity.createdAt` (same judgment call already documented
/// for `OrderDisplay.scheduledDate`, `PaymentDisplay.paymentDate`,
/// `NotificationDisplay.timeAgo` and `ReviewDisplay.formattedDate`: no
/// second, fabricated timestamp).
///
/// Nothing here is added to the domain entities themselves. No `Color`
/// or `IconData` is stored anywhere in this model — every widget
/// resolves both purely from `context.colors.*`/`Icons.*` at build
/// time.
class ProfileDisplay {
  const ProfileDisplay({
    required this.profile,
    required this.identity,
    required this.contacts,
    required this.address,
    required this.completionPercentage,
    required this.profileCompletionItems,
  });

  final Profile profile;
  final Identity identity;
  final List<Contact> contacts;
  final Address address;

  /// Simulated — see the class doc.
  final int completionPercentage;

  /// Simulated — see the class doc.
  final List<String> profileCompletionItems;

  String get displayName => profile.displayName;

  /// Derived from the real `Identity.createdAt` — see the class doc.
  String get memberSince {
    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    final date = identity.createdAt;
    return '${months[date.month - 1]} de ${date.year}';
  }
}
