import '../../../address/entities/address.dart';
import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';
import 'request_priority.dart';

/// Presentation-only composition of everything a Request Service screen
/// needs. [category] is always real and required — every order belongs
/// to one. [provider]/[service]/[profile] are only present for a
/// **direct hire** (the client picked a specific provider + service);
/// they are `null` for an **open request** (client only picked a
/// category) — see `Order`'s own doc comment for the same
/// direct-hire/open-request split on the domain side.
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
    required this.category,
    this.provider,
    this.service,
    this.profile,
    required this.address,
    required this.selectedDate,
    required this.selectedTime,
    required this.problemDescription,
    required this.attachments,
    required this.priority,
    required this.simulatedLocationLabel,
  });

  final Category category;
  final Provider? provider;
  final Service? service;
  final Profile? profile;
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

  /// `true` when the client picked a specific provider + service instead
  /// of just a category — see the class doc.
  bool get isDirectHire => provider != null && service != null;

  String? get providerName => profile?.displayName;
}
