import 'package:collection/collection.dart';

/// Base class for domain Value Objects.
/// Two value objects are equal when all of their declared [props] are equal.
abstract class ValueObject {
  const ValueObject();

  /// The list of properties used to determine equality.
  List<Object?> get props;

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ValueObject &&
        runtimeType == other.runtimeType &&
        const DeepCollectionEquality().equals(props, other.props);
  }

  @override
  int get hashCode => const DeepCollectionEquality().hash(props);
}
