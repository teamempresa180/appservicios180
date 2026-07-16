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
