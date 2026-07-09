/// Base class for domain Entities.
/// Two entities are equal when they are of the same runtime type and share
/// the same identity ([id]).
abstract class Entity<TId> {
  const Entity(this.id);

  final TId id;

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Entity<TId> &&
        runtimeType == other.runtimeType &&
        id == other.id;
  }

  @override
  int get hashCode => Object.hash(runtimeType, id);
}
