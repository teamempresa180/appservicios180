import '../../../address/entities/address.dart';
import '../../../availability/entities/availability.dart';
import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';
import 'request_priority.dart';

/// Presentation-only composition of everything a Request Service screen
/// needs. Composes six real domain entities — [service], [provider],
/// [profile], [category], [availability], [address] — plus fields that
/// have no domain equivalent yet and are explicitly simulated:
///
/// - [selectedDate]/[selectedTime]: **simulated** — there is no
///   Schedule/booking slot concept implemented in the domain yet
///   (`Schedule` module is domain-only, not wired to any use case). These
///   are plain, locally-editable values with no persistence.
/// - [problemDescription]: **simulated** — free text typed by the user,
///   never sent anywhere.
/// - [attachments]: **simulated** — `Attachment` exists as a domain
///   concept but has no upload/camera integration here; these are just
///   labels rendered as neutral placeholders (same approach as
///   `service_detail`'s `images`).
/// - [priority]: **simulated** — see [RequestPriority], no domain
///   equivalent.
/// - [simulatedLocationLabel]: **simulated** — a label standing in for a
///   map pin; no maps/geolocation integration exists.
///
/// Nothing here is added to the domain entities themselves.
class RequestServiceData {
  const RequestServiceData({
    required this.service,
    required this.provider,
    required this.profile,
    required this.category,
    required this.availability,
    required this.address,
    required this.selectedDate,
    required this.selectedTime,
    required this.problemDescription,
    required this.attachments,
    required this.priority,
    required this.simulatedLocationLabel,
  });

  final Service service;
  final Provider provider;
  final Profile profile;
  final Category category;
  final Availability availability;
  final Address address;

  /// Simulated — see the class doc.
  final DateTime selectedDate;

  /// Simulated — see the class doc.
  final String selectedTime;

  /// Simulated — see the class doc.
  final String problemDescription;

  /// Simulated — see the class doc.
  final List<String> attachments;

  /// Simulated — see the class doc.
  final RequestPriority priority;

  /// Simulated — see the class doc.
  final String simulatedLocationLabel;

  String get providerName => profile.displayName;
}
