import '../../../contact/entities/contact.dart';
import '../../../contact/models/contact_status.dart';
import '../../../profiles/entities/profile.dart';

/// Presentation-only composition of everything the Contact Management
/// screen needs. Composes two real domain entities — [profile],
/// [contacts] — with **no simulated field at all**, the same
/// intentional deviation already documented for
/// `ScheduleDisplay`: everything the screen shows (per-status/per-type
/// counts, each contact's type/value/status) is directly derivable
/// from the real `Contact` list, so nothing needed to be fabricated.
/// See the feature README.
///
/// Nothing here is added to the domain entities themselves. No `Color`
/// or `IconData` is stored anywhere in this model — every widget
/// resolves both purely from `context.colors.*`/`Icons.*` at build
/// time.
class ContactManagementDisplay {
  const ContactManagementDisplay({
    required this.profile,
    required this.contacts,
  });

  final Profile profile;
  final List<Contact> contacts;

  /// Derived from the real [contacts] — see the class doc.
  int get activeCount =>
      contacts.where((c) => c.status == ContactStatus.active).length;

  /// Derived from the real [contacts] — see the class doc.
  int get inactiveCount =>
      contacts.where((c) => c.status == ContactStatus.inactive).length;

  /// Derived from the real [contacts] — see the class doc.
  int get archivedCount =>
      contacts.where((c) => c.status == ContactStatus.archived).length;
}
