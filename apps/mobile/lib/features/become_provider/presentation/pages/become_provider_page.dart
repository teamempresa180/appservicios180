import 'package:flutter/material.dart';
import '../../../../category/entities/category.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_scaffold.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../../../provider/entities/provider.dart';
import '../../../../provider/models/provider_status.dart';
import '../../local/become_provider_draft.dart';
import '../../local/become_provider_draft_storage.dart';
import '../../repositories/become_provider_repository.dart';
import '../../specialization/models/specialization.dart';
import '../widgets/documentation_step.dart';
import '../widgets/experience_step.dart';
import '../widgets/personal_info_step.dart';
import '../widgets/rejected_application_view.dart';
import '../widgets/specialization_step.dart';
import '../widgets/summary_step.dart';

/// Ordered wizard steps — one screen each, per the user's explicit
/// requirement that provider registration feel like a guided,
/// step-by-step flow rather than a single long form.
enum _Step {
  loading,
  personalInfo,
  specialization,
  experience,
  documentation,
  summary,
  submitting,
  done,
  existingApplication,
}

/// The five real wizard steps shown in the progress header —
/// [_Step.loading]/[_Step.submitting] are transient, and [_Step.done]/
/// [_Step.existingApplication] are terminal screens, not steps.
const _wizardSteps = [
  _Step.personalInfo,
  _Step.specialization,
  _Step.experience,
  _Step.documentation,
  _Step.summary,
];

const _stepLabels = {
  _Step.personalInfo: 'Información personal',
  _Step.specialization: 'Especialización',
  _Step.experience: 'Experiencia',
  _Step.documentation: 'Documentación',
  _Step.summary: 'Resumen',
};

/// "Quiero convertirme en proveedor" flow, reached from Profile —
/// deliberately independent of Register: the applicant is already a
/// logged-in Customer, so this only collects what Register didn't
/// (professional information) plus what other features already own
/// (photo, address, phone — reused, not re-asked) and the 7 required
/// verification documents. Ends with the account's real `Provider`
/// record in `ProviderStatus.pending`.
///
/// A returning applicant never sees the wizard again —
/// [_checkExistingApplication] runs first and shows their real status
/// instead (see `BecomeProviderRepository.getExistingApplication`'s
/// doc comment). An in-progress, not-yet-submitted wizard survives an
/// app restart via [BecomeProviderDraftStorage] (Pasos 2-3's field
/// values only — Pasos 1 and 4 already persist through their own
/// repositories as the applicant fills them in).
class BecomeProviderPage extends StatefulWidget {
  const BecomeProviderPage({
    super.key,
    BecomeProviderRepository? repository,
    BecomeProviderDraftStorage? draftStorage,
  }) : _repository = repository,
       _draftStorage = draftStorage;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final BecomeProviderRepository? _repository;
  final BecomeProviderDraftStorage? _draftStorage;

  @override
  State<BecomeProviderPage> createState() => _BecomeProviderPageState();
}

class _BecomeProviderPageState extends State<BecomeProviderPage> {
  late final BecomeProviderRepository _repository =
      widget._repository ?? locator<BecomeProviderRepository>();
  late final BecomeProviderDraftStorage _draftStorage =
      widget._draftStorage ?? BecomeProviderDraftStorage();

  _Step _step = _Step.loading;
  List<Category> _categories = const [];
  Category? _selectedCategory;
  Specialization? _specialization;
  BecomeProviderDraft _draft = const BecomeProviderDraft();
  Provider? _existingProvider;
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    _checkExistingApplication();
  }

  /// Checked first, before the wizard even starts — a returning
  /// applicant (role stuck at Customer until their Provider record
  /// reaches `active`) must see their current status here instead of
  /// being able to re-run the whole application from scratch.
  Future<void> _checkExistingApplication() async {
    try {
      final existing = await _repository.getExistingApplication();
      if (!mounted) return;
      if (existing != null) {
        await _draftStorage.clear();
        setState(() {
          _existingProvider = existing;
          _step = _Step.existingApplication;
        });
        return;
      }
    } catch (_) {
      // No reliable way to tell "no application yet" apart from a
      // transient error here — fail open into the normal wizard rather
      // than blocking a first-time applicant on a network hiccup.
    }
    if (!mounted) return;
    await _loadWizard();
  }

  Future<void> _loadWizard() async {
    try {
      final results = await Future.wait([
        _repository.getCategories(),
        _draftStorage.read(),
      ]);
      if (!mounted) return;
      final categories = results[0] as List<Category>;
      final draft =
          (results[1] as BecomeProviderDraft?) ?? const BecomeProviderDraft();
      final restoredCategory = draft.categoryId == null
          ? null
          : categories.cast<Category?>().firstWhere(
              (c) => c?.id.value == draft.categoryId,
              orElse: () => null,
            );
      setState(() {
        _categories = categories;
        _selectedCategory =
            restoredCategory ?? (categories.isEmpty ? null : categories.first);
        _draft = draft;
        _specialization =
            (draft.specializationId != null && draft.specializationName != null)
            ? Specialization(
                id: draft.specializationId!,
                name: draft.specializationName!,
              )
            : null;
        _step = _wizardSteps[draft.stepIndex.clamp(0, _wizardSteps.length - 1)];
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _categories = const [];
        _step = _Step.personalInfo;
      });
      AppSnackBar.show(
        context,
        'No se pudieron cargar las categorías.',
        type: AppSnackBarType.error,
      );
    }
  }

  Future<void> _goTo(_Step step, {BecomeProviderDraft? draft}) async {
    if (draft != null) {
      _draft = draft;
      await _draftStorage.save(
        _draft.copyWith(stepIndex: _wizardSteps.indexOf(step)),
      );
    }
    if (!mounted) return;
    setState(() => _step = step);
  }

  void _onPersonalInfoContinue() => _goTo(_Step.specialization);

  void _onCategoryChanged(Category category) {
    setState(() => _selectedCategory = category);
  }

  void _onSpecializationSelected(Specialization specialization) {
    _specialization = specialization;
  }

  Future<void> _onSpecializationContinue() async {
    final category = _selectedCategory;
    final specialization = _specialization;
    if (category == null || specialization == null) return;
    await _goTo(
      _Step.experience,
      draft: _draft.copyWith(
        categoryId: category.id.value,
        specializationId: specialization.id,
        specializationName: specialization.name,
      ),
    );
  }

  Future<void> _onExperienceContinue(ExperienceStepResult result) async {
    await _goTo(
      _Step.documentation,
      draft: _draft.copyWith(
        yearsOfExperience: result.yearsOfExperience,
        previousCompany: result.previousCompany ?? '',
        isIndependent: result.isIndependent,
        biography: result.biography,
      ),
    );
  }

  Future<void> _onDocumentationContinue() => _goTo(_Step.summary);

  Future<void> _onSubmit() async {
    final category = _selectedCategory;
    final specialization = _specialization;
    if (category == null || specialization == null) return;
    setState(() => _submitting = true);
    try {
      await _repository.apply(
        category: category,
        specializationName: specialization.name,
        yearsOfExperience: _draft.yearsOfExperience ?? 0,
        previousCompany: (_draft.previousCompany?.isEmpty ?? true)
            ? null
            : _draft.previousCompany,
        isIndependent: _draft.isIndependent,
        biography: _draft.biography ?? '',
      );
      await _draftStorage.clear();
      if (!mounted) return;
      setState(() {
        _submitting = false;
        _step = _Step.done;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _submitting = false);
      AppSnackBar.show(
        context,
        'No se pudo enviar la solicitud. Inténtalo de nuevo.',
        type: AppSnackBarType.error,
      );
    }
  }

  Widget _buildDone() {
    return AppEmptyState(
      icon: Icons.hourglass_top_outlined,
      title: 'Solicitud enviada',
      description:
          'Tu cuenta quedó en estado "Pendiente de verificación". '
          'Cuando revisemos tus documentos, podrás aparecer en las '
          'búsquedas y recibir solicitudes.',
      actionLabel: 'Volver a mi perfil',
      onActionPressed: () => Navigator.of(context).pop(),
    );
  }

  /// Shown instead of the wizard for a returning applicant who already
  /// has a `Provider` record.
  Widget _buildExistingApplication() {
    final provider = _existingProvider!;
    if (provider.status == ProviderStatus.rejected) {
      return RejectedApplicationView(
        provider: provider,
        repository: _repository,
        onResubmitted: () {
          AppSnackBar.show(
            context,
            'Tu solicitud fue reenviada. La revisaremos de nuevo.',
            type: AppSnackBarType.success,
          );
          setState(() {
            _existingProvider = Provider(
              id: provider.id,
              identityId: provider.identityId,
              providerProfileId: provider.providerProfileId,
              status: ProviderStatus.pending,
              type: provider.type,
              experience: provider.experience,
              biography: provider.biography,
              yearsOfExperience: provider.yearsOfExperience,
              createdAt: provider.createdAt,
              updatedAt: DateTime.now(),
            );
          });
        },
      );
    }

    final (title, description) = switch (provider.status) {
      ProviderStatus.pending => (
        'Estamos verificando tu información',
        'Tu solicitud para ser proveedor fue recibida. Un miembro de '
            'nuestro equipo revisará tus datos y documentos en los '
            'próximos días — te avisaremos apenas empiece la revisión.',
      ),
      ProviderStatus.inReview => (
        'Tu cuenta está en revisión',
        'Estamos revisando activamente los documentos que subiste '
            '(identidad, antecedentes, certificados). Esto puede tomar '
            'un tiempo — te avisaremos en cuanto termine.',
      ),
      ProviderStatus.rejected => ('', ''), // handled above
      ProviderStatus.suspended => (
        'Cuenta suspendida',
        'Tu cuenta de proveedor está suspendida temporalmente. '
            'Contacta a soporte para más información.',
      ),
      ProviderStatus.blocked => (
        'Cuenta bloqueada',
        'Tu cuenta de proveedor fue bloqueada. Contacta a soporte para '
            'más información.',
      ),
      ProviderStatus.active => (
        '¡Ya eres proveedor!',
        'Tu cuenta ya fue aprobada. Ingresa desde "Panel del '
            'proveedor" en tu perfil para empezar a recibir '
            'solicitudes.',
      ),
      ProviderStatus.inactive || ProviderStatus.archived => (
        'Cuenta de proveedor inactiva',
        'Tu cuenta de proveedor no está activa en este momento. '
            'Contacta a soporte para más información.',
      ),
    };
    return AppEmptyState(
      icon: Icons.hourglass_top_outlined,
      title: title,
      description: description,
      actionLabel: 'Volver a mi perfil',
      onActionPressed: () => Navigator.of(context).pop(),
    );
  }

  Widget _buildBody() {
    switch (_step) {
      case _Step.loading:
      case _Step.submitting:
        return const AppLoading(message: 'Cargando...');
      case _Step.personalInfo:
        return PersonalInfoStep(onContinue: _onPersonalInfoContinue);
      case _Step.specialization:
        return SpecializationStep(
          categories: _categories,
          selectedCategory: _selectedCategory,
          onCategoryChanged: _onCategoryChanged,
          initialSpecializationId: _draft.specializationId,
          onSpecializationSelected: _onSpecializationSelected,
          onContinue: _onSpecializationContinue,
        );
      case _Step.experience:
        return ExperienceStep(
          onContinue: _onExperienceContinue,
          initialYearsOfExperience: _draft.yearsOfExperience,
          initialPreviousCompany: _draft.previousCompany,
          initialIsIndependent: _draft.isIndependent,
          initialBiography: _draft.biography,
        );
      case _Step.documentation:
        return DocumentationStep(
          repository: _repository,
          onContinue: _onDocumentationContinue,
        );
      case _Step.summary:
        return SummaryStep(
          categoryName: _selectedCategory?.name ?? '',
          specializationName: _specialization?.name ?? '',
          yearsOfExperience: _draft.yearsOfExperience ?? 0,
          previousCompany: (_draft.previousCompany?.isEmpty ?? true)
              ? null
              : _draft.previousCompany,
          isIndependent: _draft.isIndependent,
          biography: _draft.biography ?? '',
          documentsUploadedCount: 7,
          documentsRequiredCount: 7,
          isSubmitting: _submitting,
          onSubmit: _onSubmit,
        );
      case _Step.done:
        return _buildDone();
      case _Step.existingApplication:
        return _buildExistingApplication();
    }
  }

  /// "Paso X de 5" progress header — hidden on transient/terminal
  /// screens.
  Widget? _buildStepHeader() {
    final index = _wizardSteps.indexOf(_step);
    if (index == -1) return null;
    final total = _wizardSteps.length;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          'Paso ${index + 1} de $total · ${_stepLabels[_step]}',
          style: context.textStyles.bodySmall,
        ),
        const SizedBox(height: AppSpacing.space8),
        ClipRRect(
          borderRadius: BorderRadius.circular(AppSpacing.space4),
          child: LinearProgressIndicator(value: (index + 1) / total),
        ),
        const SizedBox(height: AppSpacing.space16),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final stepHeader = _buildStepHeader();
    return AppScaffold(
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const AppSectionTitle(title: 'Conviértete en proveedor'),
            const SizedBox(height: AppSpacing.space16),
            ?stepHeader,
            _buildBody(),
          ],
        ),
      ),
    );
  }
}
