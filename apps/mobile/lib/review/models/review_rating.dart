import '../../core/base/value_object.dart';

/// Represents the numeric rating a customer gives in a review. Pure data
/// wrapper — no scale validation, no aggregation, no scoring logic.
class ReviewRating extends ValueObject {
  const ReviewRating.of(this.value);

  final num value;

  @override
  List<Object?> get props => [value];
}
