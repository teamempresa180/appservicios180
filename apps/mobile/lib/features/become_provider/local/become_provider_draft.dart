/// In-progress, not-yet-submitted state of Paso 2 ("Especialización")
/// and Paso 3 ("Experiencia") of the provider wizard — the only steps
/// whose values live purely in local form state until the final
/// "Enviar" on Paso 5. Paso 1 (photo/address/phone) and Paso 4
/// (documents) already persist through their own real repositories as
/// the applicant fills them in, so there's nothing to draft there.
///
/// Plain data holder with a hand-rolled `toJson`/`fromJson` — no
/// `json_serializable` dependency for a single, small, local-only
/// model.
class BecomeProviderDraft {
  const BecomeProviderDraft({
    this.stepIndex = 0,
    this.categoryId,
    this.specializationId,
    this.specializationName,
    this.yearsOfExperience,
    this.previousCompany,
    this.isIndependent = true,
    this.biography,
  });

  /// Index into the wizard's 5 visible steps, so reopening the app
  /// resumes on the same step rather than always restarting at Paso 1.
  final int stepIndex;
  final String? categoryId;
  final String? specializationId;
  final String? specializationName;
  final int? yearsOfExperience;
  final String? previousCompany;
  final bool isIndependent;
  final String? biography;

  BecomeProviderDraft copyWith({
    int? stepIndex,
    String? categoryId,
    String? specializationId,
    String? specializationName,
    int? yearsOfExperience,
    String? previousCompany,
    bool? isIndependent,
    String? biography,
  }) {
    return BecomeProviderDraft(
      stepIndex: stepIndex ?? this.stepIndex,
      categoryId: categoryId ?? this.categoryId,
      specializationId: specializationId ?? this.specializationId,
      specializationName: specializationName ?? this.specializationName,
      yearsOfExperience: yearsOfExperience ?? this.yearsOfExperience,
      previousCompany: previousCompany ?? this.previousCompany,
      isIndependent: isIndependent ?? this.isIndependent,
      biography: biography ?? this.biography,
    );
  }

  Map<String, dynamic> toJson() => {
    'stepIndex': stepIndex,
    'categoryId': categoryId,
    'specializationId': specializationId,
    'specializationName': specializationName,
    'yearsOfExperience': yearsOfExperience,
    'previousCompany': previousCompany,
    'isIndependent': isIndependent,
    'biography': biography,
  };

  factory BecomeProviderDraft.fromJson(Map<String, dynamic> json) {
    return BecomeProviderDraft(
      stepIndex: json['stepIndex'] as int? ?? 0,
      categoryId: json['categoryId'] as String?,
      specializationId: json['specializationId'] as String?,
      specializationName: json['specializationName'] as String?,
      yearsOfExperience: json['yearsOfExperience'] as int?,
      previousCompany: json['previousCompany'] as String?,
      isIndependent: json['isIndependent'] as bool? ?? true,
      biography: json['biography'] as String?,
    );
  }
}
