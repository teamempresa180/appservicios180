/// Backend enums serialize as `SCREAMING_SNAKE_CASE` (e.g. `IN_PROGRESS`,
/// `CONTACTS_ONLY`); every Dart domain enum in this app uses `camelCase`
/// members (e.g. `inProgress`, `contactsOnly`) — same words, different
/// casing convention. This is the single place that bridges the two, so
/// every HTTP mapper can just call `Enum.values.byName(enumFromJson(x))`.
String enumFromJson(String snakeCase) {
  final words = snakeCase.toLowerCase().split('_');
  return words.first +
      words.skip(1).map((w) => w[0].toUpperCase() + w.substring(1)).join();
}

/// The reverse of [enumFromJson] — needed by the few repository methods
/// that send an enum value to the backend (e.g. `Contact.type` on
/// create) instead of only ever reading one back.
String enumToJson(String camelCase) {
  final buffer = StringBuffer();
  for (var i = 0; i < camelCase.length; i++) {
    final char = camelCase[i];
    if (i > 0 && char.toUpperCase() == char && char.toLowerCase() != char) {
      buffer.write('_');
    }
    buffer.write(char.toUpperCase());
  }
  return buffer.toString();
}
