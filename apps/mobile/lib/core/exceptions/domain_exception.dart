/// Base exception for all domain-level errors across every module.
/// Modules should extend this instead of throwing raw exceptions.
abstract class DomainException implements Exception {
  const DomainException(this.message);

  final String message;

  @override
  String toString() => '$runtimeType: $message';
}
