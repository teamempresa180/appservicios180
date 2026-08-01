/// A specialization within a service `Category` (e.g. "Residencial"
/// within "Electricidad"). Deliberately a plain, minimal value —
/// `{id, name}` — not a full domain `Entity`: this concept is
/// temporary/mock-only on the mobile side until the real backend
/// endpoint (`GET /categories/:categoryId/specializations`) lands, at
/// which point `HttpSpecializationRepository` can map straight onto
/// this same shape.
class Specialization {
  const Specialization({required this.id, required this.name});

  final String id;
  final String name;

  @override
  bool operator ==(Object other) =>
      other is Specialization && other.id == id && other.name == name;

  @override
  int get hashCode => Object.hash(id, name);
}
