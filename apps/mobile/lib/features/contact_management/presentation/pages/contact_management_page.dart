import 'package:flutter/material.dart';
import '../../../../contact/entities/contact.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../repositories/contact_management_repository.dart';
import '../view_models/contact_management_view_model.dart';
import '../widgets/add_contact_button.dart';
import '../widgets/contact_card.dart';
import '../widgets/contact_form_sheet.dart';
import '../widgets/contacts_empty_state.dart';
import '../widgets/contacts_header.dart';
import '../widgets/contacts_loading.dart';
import '../widgets/contacts_statistics.dart';

/// Contact Management screen. Does NOT build its own `Scaffold` — it
/// is meant to live within the existing navigation flow (opened from
/// `Settings`). Loads from the real backend via
/// [ContactManagementViewModel] (resolved from the service locator —
/// see `core/di/service_locator.dart`). "Agregar contacto"/"Editar"/
/// "Eliminar" all call through to the real `ContactManagementRepository`
/// CRUD methods.
class ContactManagementPage extends StatefulWidget {
  const ContactManagementPage({super.key, ContactManagementRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final ContactManagementRepository? _repository;

  @override
  State<ContactManagementPage> createState() => _ContactManagementPageState();
}

class _ContactManagementPageState extends State<ContactManagementPage> {
  late final ContactManagementRepository _repository =
      widget._repository ?? locator<ContactManagementRepository>();
  late final ContactManagementViewModel _viewModel = ContactManagementViewModel(
    _repository,
  );

  @override
  void initState() {
    super.initState();
    _viewModel.load();
    _viewModel.addListener(_onViewModelChanged);
  }

  void _onViewModelChanged() => setState(() {});

  @override
  void dispose() {
    _viewModel.removeListener(_onViewModelChanged);
    _viewModel.dispose();
    super.dispose();
  }

  Future<void> _create() async {
    final result = await ContactFormSheet.show(context);
    if (result == null || !mounted) return;
    await _repository.createContact(type: result.type!, value: result.value);
    if (!mounted) return;
    AppSnackBar.show(context, 'Contacto agregado.', type: AppSnackBarType.success);
    await _viewModel.load();
  }

  Future<void> _edit(Contact contact) async {
    final result = await ContactFormSheet.show(
      context,
      isEditing: true,
      initialValue: contact.value,
      initialType: contact.type,
    );
    if (result == null || !mounted) return;
    await _repository.updateContact(contact, value: result.value);
    if (!mounted) return;
    AppSnackBar.show(
      context,
      'Contacto actualizado.',
      type: AppSnackBarType.success,
    );
    await _viewModel.load();
  }

  Future<void> _delete(Contact contact) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar contacto'),
        content: Text('¿Eliminar "${contact.value}"? Esta acción no se puede deshacer.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;
    await _repository.deleteContact(contact);
    if (!mounted) return;
    AppSnackBar.show(context, 'Contacto eliminado.', type: AppSnackBarType.info);
    await _viewModel.load();
  }

  Widget _buildBody() {
    switch (_viewModel.status) {
      case ContactManagementLoadStatus.loading:
        return const ContactsLoading();
      case ContactManagementLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudieron cargar los contactos',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case ContactManagementLoadStatus.success:
        final data = _viewModel.data!;
        if (data.contacts.isEmpty) return const ContactsEmptyState();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: ContactsStatistics(data: data)),
            const SizedBox(height: AppSpacing.space16),
            Column(
              children: [
                for (final (index, contact) in data.contacts.indexed) ...[
                  FadeIn(
                    delay: staggerDelayFor(index),
                    child: SlideIn(
                      child: ContactCard(
                        contact: contact,
                        onEdit: () => _edit(contact),
                        onDelete: () => _delete(contact),
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.space12),
                ],
              ],
            ),
            AddContactButton(onPressed: _create),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(header: const ContactsHeader(), body: _buildBody());
  }
}
