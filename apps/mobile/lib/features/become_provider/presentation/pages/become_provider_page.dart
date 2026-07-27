import 'package:flutter/material.dart';
import '../../../../category/entities/category.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_scaffold.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../../../core/ui/widgets/app_text_field.dart';
import '../../../../verification/entities/verification.dart';
import '../../../profile/repositories/profile_repository.dart';
import '../../models/provider_application.dart';
import '../../repositories/become_provider_repository.dart';
import '../widgets/document_upload_field.dart';
import '../widgets/selfie_capture_field.dart';

/// Ordered wizard steps — one screen each, per the user's explicit
/// requirement that provider registration feel like a guided
/// verification flow (selfie, then professional info, then each
/// document on its own screen), not a single long form.
enum _Step {
  loadingCategories,
  selfie,
  form,
  submitting,
  criminalRecord,
  certification,
  done,
}

/// The four steps shown in the progress header — [_Step.loadingCategories]
/// and [_Step.submitting] are transient/loading states, not steps of
/// their own.
const _wizardSteps = [
  _Step.selfie,
  _Step.form,
  _Step.criminalRecord,
  _Step.certification,
];

/// "Quiero convertirme en proveedor" flow, reached from Profile —
/// deliberately independent of Register (see the feature's design
/// rationale): the applicant is already a logged-in Customer, so this
/// only collects professional information (category, specialization,
/// years of experience, biography, city/department, coverage) plus
/// a selfie and the two required documents (criminal record,
/// certification), each as its own step/screen. Ends with the
/// account's real `Provider` record in `ProviderStatus.pending` — see
/// `HttpBecomeProviderRepository`'s doc comment for the full
/// data-mapping rationale and the (missing) admin-approval caveat.
class BecomeProviderPage extends StatefulWidget {
  const BecomeProviderPage({
    super.key,
    BecomeProviderRepository? repository,
    ProfileRepository? profileRepository,
  }) : _repository = repository,
       _profileRepository = profileRepository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repositories from the service locator.
  final BecomeProviderRepository? _repository;
  final ProfileRepository? _profileRepository;

  @override
  State<BecomeProviderPage> createState() => _BecomeProviderPageState();
}

class _BecomeProviderPageState extends State<BecomeProviderPage> {
  late final BecomeProviderRepository _repository =
      widget._repository ?? locator<BecomeProviderRepository>();
  late final ProfileRepository _profileRepository =
      widget._profileRepository ?? locator<ProfileRepository>();

  final _formKey = GlobalKey<FormState>();
  final _specializationController = TextEditingController();
  final _yearsController = TextEditingController();
  final _biographyController = TextEditingController();
  final _cityController = TextEditingController();
  final _departmentController = TextEditingController();
  final _coverageController = TextEditingController();

  _Step _step = _Step.loadingCategories;
  List<Category> _categories = const [];
  Category? _selectedCategory;
  String? _errorMessage;
  ProviderApplication? _application;

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  @override
  void dispose() {
    _specializationController.dispose();
    _yearsController.dispose();
    _biographyController.dispose();
    _cityController.dispose();
    _departmentController.dispose();
    _coverageController.dispose();
    super.dispose();
  }

  Future<void> _loadCategories() async {
    try {
      final categories = await _repository.getCategories();
      if (!mounted) return;
      setState(() {
        _categories = categories;
        _selectedCategory = categories.isEmpty ? null : categories.first;
        _step = _Step.selfie;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _errorMessage = 'No se pudieron cargar las categorías.';
        _step = _Step.selfie;
      });
    }
  }

  Future<void> _uploadSelfie(List<int> bytes, String fileName) =>
      _profileRepository.updateAvatar(fileBytes: bytes, fileName: fileName);

  void _onSelfieUploaded(bool success) {
    if (success) setState(() => _step = _Step.form);
  }

  Future<void> _submit() async {
    final category = _selectedCategory;
    if (!(_formKey.currentState?.validate() ?? false) || category == null) {
      return;
    }
    setState(() => _step = _Step.submitting);
    try {
      final application = await _repository.apply(
        category: category,
        specialization: _specializationController.text.trim(),
        yearsOfExperience: int.parse(_yearsController.text.trim()),
        biography: _biographyController.text.trim(),
        city: _cityController.text.trim(),
        department: _departmentController.text.trim(),
        coverage: _coverageController.text.trim(),
      );
      if (!mounted) return;
      setState(() {
        _application = application;
        _step = _Step.criminalRecord;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _step = _Step.form);
      AppSnackBar.show(
        context,
        'No se pudo enviar la solicitud. Inténtalo de nuevo.',
        type: AppSnackBarType.error,
      );
    }
  }

  Future<void> _uploadFor(
    Verification verification,
    List<int> bytes,
    String fileName,
    ValueChanged<double> onProgress,
  ) => _repository.uploadDocument(
    verification: verification,
    fileBytes: bytes,
    fileName: fileName,
    onProgress: onProgress,
  );

  void _onCriminalRecordUploaded(bool success) {
    if (success) setState(() => _step = _Step.certification);
  }

  void _onCertificationUploaded(bool success) {
    if (success) setState(() => _step = _Step.done);
  }

  Widget _buildForm() {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                if (_errorMessage != null) ...[
                  Text(
                    _errorMessage!,
                    style: context.textStyles.bodySmall?.copyWith(
                      color: context.colors.error,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.space12),
                ],
                DropdownButtonFormField<Category>(
                  initialValue: _selectedCategory,
                  isExpanded: true,
                  decoration: const InputDecoration(
                    labelText: 'Categoría principal',
                  ),
                  items: [
                    for (final category in _categories)
                      DropdownMenuItem(
                        value: category,
                        child: Text(category.name),
                      ),
                  ],
                  onChanged: (value) =>
                      setState(() => _selectedCategory = value),
                ),
                const SizedBox(height: AppSpacing.space16),
                AppTextField(
                  controller: _specializationController,
                  label: 'Especialización',
                  hint: 'Ej. Reparación de fugas',
                  validator: (value) => (value == null || value.trim().isEmpty)
                      ? 'La especialización es obligatoria.'
                      : null,
                ),
                const SizedBox(height: AppSpacing.space16),
                AppTextField(
                  controller: _yearsController,
                  label: 'Años de experiencia',
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    final parsed = int.tryParse(value?.trim() ?? '');
                    if (parsed == null || parsed < 0) {
                      return 'Ingresa un número válido de años.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: AppSpacing.space16),
                AppTextField(
                  controller: _biographyController,
                  label: 'Biografía',
                  hint: 'Cuéntales a tus clientes sobre tu experiencia',
                  validator: (value) => (value == null || value.trim().isEmpty)
                      ? 'La biografía es obligatoria.'
                      : null,
                ),
                const SizedBox(height: AppSpacing.space16),
                AppTextField(
                  controller: _cityController,
                  label: 'Ciudad',
                  validator: (value) => (value == null || value.trim().isEmpty)
                      ? 'La ciudad es obligatoria.'
                      : null,
                ),
                const SizedBox(height: AppSpacing.space16),
                AppTextField(
                  controller: _departmentController,
                  label: 'Departamento',
                  validator: (value) => (value == null || value.trim().isEmpty)
                      ? 'El departamento es obligatorio.'
                      : null,
                ),
                const SizedBox(height: AppSpacing.space16),
                AppTextField(
                  controller: _coverageController,
                  label: 'Cobertura del servicio',
                  hint: 'Ej. Toda la ciudad, 10 km a la redonda',
                  validator: (value) => (value == null || value.trim().isEmpty)
                      ? 'La cobertura es obligatoria.'
                      : null,
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.space20),
          AppButton(label: 'Enviar solicitud', onPressed: _submit),
        ],
      ),
    );
  }

  Widget _buildSelfieStep() {
    return SelfieCaptureField(
      onUpload: _uploadSelfie,
      onUploaded: _onSelfieUploaded,
    );
  }

  Widget _buildCriminalRecordStep() {
    final application = _application!;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          'Sube tu certificado de antecedentes penales.',
          style: context.textStyles.bodyMedium,
        ),
        const SizedBox(height: AppSpacing.space16),
        DocumentUploadField(
          title: 'Antecedentes penales',
          description: 'PDF o imagen, máximo 5 MB.',
          onUpload: (bytes, fileName, onProgress) => _uploadFor(
            application.criminalRecordVerification,
            bytes,
            fileName,
            onProgress,
          ),
          onUploaded: _onCriminalRecordUploaded,
        ),
      ],
    );
  }

  Widget _buildCertificationStep() {
    final application = _application!;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          'Sube tu certificación o título profesional.',
          style: context.textStyles.bodyMedium,
        ),
        const SizedBox(height: AppSpacing.space16),
        DocumentUploadField(
          title: 'Certificación o título profesional',
          description: 'PDF o imagen, máximo 5 MB.',
          onUpload: (bytes, fileName, onProgress) => _uploadFor(
            application.certificationVerification,
            bytes,
            fileName,
            onProgress,
          ),
          onUploaded: _onCertificationUploaded,
        ),
      ],
    );
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

  Widget _buildBody() {
    switch (_step) {
      case _Step.loadingCategories:
      case _Step.submitting:
        return const AppLoading(message: 'Cargando...');
      case _Step.selfie:
        return _buildSelfieStep();
      case _Step.form:
        return _buildForm();
      case _Step.criminalRecord:
        return _buildCriminalRecordStep();
      case _Step.certification:
        return _buildCertificationStep();
      case _Step.done:
        return _buildDone();
    }
  }

  /// "Paso X de 4" progress header — hidden on the transient
  /// loading/submitting states and on the final [_Step.done] screen.
  Widget? _buildStepHeader() {
    final index = _wizardSteps.indexOf(_step);
    if (index == -1) return null;
    final total = _wizardSteps.length;
    const labels = {
      _Step.selfie: 'Foto de rostro',
      _Step.form: 'Información profesional',
      _Step.criminalRecord: 'Antecedentes penales',
      _Step.certification: 'Certificación',
    };
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          'Paso ${index + 1} de $total · ${labels[_step]}',
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
            if (stepHeader != null) stepHeader,
            _buildBody(),
          ],
        ),
      ),
    );
  }
}
