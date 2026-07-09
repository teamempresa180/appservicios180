import 'dart:math';

/// Generates a RFC-4122 v4 compliant UUID without any external dependency.
/// Pure utility — no persistence, no I/O.
String generateId() {
  final random = Random.secure();
  const chars = '0123456789abcdef';

  String randomHex(int length) =>
      List.generate(length, (_) => chars[random.nextInt(16)]).join();

  final variantChar = chars[8 + random.nextInt(4)]; // one of 8, 9, a, b

  return '${randomHex(8)}-${randomHex(4)}-4${randomHex(3)}-'
      '$variantChar${randomHex(3)}-${randomHex(12)}';
}
