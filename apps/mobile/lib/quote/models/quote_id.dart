import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class QuoteId extends ValueObject {
  const QuoteId._(this.value);

  factory QuoteId.create() => QuoteId._(generateId());

  factory QuoteId.fromString(String value) => QuoteId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
