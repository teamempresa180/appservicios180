import '../../../core/base/value_object.dart';
import '../../../core/utils/id_generator.dart';

/// Identity for a [TrackingSession] — same pattern as `OrderId`/
/// `ProviderId`: an opaque generated string, not the `OrderId` itself,
/// because a single Order could in principle be tracked across more
/// than one session (e.g. paused and restarted) and each needs its own
/// identity distinct from the Order it belongs to.
class TrackingSessionId extends ValueObject {
  const TrackingSessionId._(this.value);

  factory TrackingSessionId.create() => TrackingSessionId._(generateId());

  factory TrackingSessionId.fromString(String value) =>
      TrackingSessionId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
