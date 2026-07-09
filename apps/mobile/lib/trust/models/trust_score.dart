import '../../core/base/value_object.dart';

/// Represents a trust/reputation score. Pure data wrapper — no scoring rules,
/// no range validation, no calculation logic.
class TrustScore extends ValueObject {
  const TrustScore.of(this.value);

  final num value;

  @override
  List<Object?> get props => [value];
}
