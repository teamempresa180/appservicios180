import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../address/entities/address.dart';
import '../../../../address/models/address_type.dart';
import '../../../../contact/entities/contact.dart';
import '../../../../contact/models/contact_type.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_info_row.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../../../core/ui/widgets/image_source_sheet.dart';
import '../../../../identity/entities/identity.dart';
import '../../../../identity/models/document_type.dart';
import '../../../../profiles/entities/profile.dart';
import '../../../address_management/repositories/address_management_repository.dart';
import '../../../address_management/presentation/widgets/address_form_sheet.dart';
import '../../../contact_management/repositories/contact_management_repository.dart';
import '../../../contact_management/presentation/widgets/contact_form_sheet.dart';
import '../../../profile/repositories/profile_repository.dart';

String documentTypeLabel(DocumentType type) {
  switch (type) {
    case DocumentType.nationalId:
      return 'Cédula de ciudadanía';
    case DocumentType.passport:
      return 'Pasaporte';
    case DocumentType.foreignId:
      return 'Cédula de extranjería';
    case DocumentType.taxId:
      return 'NIT';
    case DocumentType.other:
      return 'Otro documento';
  }
}

/// Paso 1 ("Información personal"): photo, identity document (read-only
/// — already captured at registration, never asked twice), address and
/// phone. Address/phone reuse the real `address_management`/
/// `contact_management` repositories and their own form sheets rather
/// than a bespoke form — if the account already has them, they're just
/// shown; only missing data is asked for.
class PersonalInfoStep extends StatefulWidget {
  const PersonalInfoStep({
    super.key,
    required this.onContinue,
    ProfileRepository? profileRepository,
    AddressManagementRepository? addressRepository,
    ContactManagementRepository? contactRepository,
  }) : _profileRepository = profileRepository,
       _addressRepository = addressRepository,
       _contactRepository = contactRepository;

  final VoidCallback onContinue;
  final ProfileRepository? _profileRepository;
  final AddressManagementRepository? _addressRepository;
  final ContactManagementRepository? _contactRepository;

  @override
  State<PersonalInfoStep> createState() => _PersonalInfoStepState();
}

enum _Status { loading, loaded, error }

class _PersonalInfoStepState extends State<PersonalInfoStep> {
  late final ProfileRepository _profileRepository =
      widget._profileRepository ?? locator<ProfileRepository>();
  late final AddressManagementRepository _addressRepository =
      widget._addressRepository ?? locator<AddressManagementRepository>();
  late final ContactManagementRepository _contactRepository =
      widget._contactRepository ?? locator<ContactManagementRepository>();

  _Status _status = _Status.loading;
  Profile? _profile;
  Identity? _identity;
  Address? _address;
  Contact? _phone;
  bool _busy = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _status = _Status.loading);
    try {
      final profile = await _profileRepository.getProfile();
      final identity = await _profileRepository.getIdentity();
      final addresses = await _addressRepository.getAddresses();
      final contacts = await _contactRepository.getContacts();
      if (!mounted) return;
      setState(() {
        _profile = profile;
        _identity = identity;
        _address = addresses.isEmpty ? null : addresses.first;
        _phone = contacts
            .cast<Contact?>()
            .firstWhere((c) => c?.type == ContactType.phone, orElse: () => null);
        _status = _Status.loaded;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _status = _Status.error);
    }
  }

  Future<void> _changePhoto() async {
    final source = await ImageSourceSheet.show(context);
    if (source == null || !mounted) return;
    final picked = await ImagePicker().pickImage(
      source: source,
      maxWidth: 1024,
      imageQuality: 85,
    );
    if (picked == null || !mounted) return;
    setState(() => _busy = true);
    try {
      final bytes = await picked.readAsBytes();
      final updated = await _profileRepository.updateAvatar(
        fileBytes: bytes,
        fileName: picked.name,
      );
      if (!mounted) return;
      setState(() {
        _profile = updated;
        _busy = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _busy = false);
      AppSnackBar.show(
        context,
        'No se pudo actualizar la foto. Inténtalo de nuevo.',
        type: AppSnackBarType.error,
      );
    }
  }

  Future<void> _addOrEditAddress() async {
    final result = await AddressFormSheet.show(
      context,
      isEditing: _address != null,
      initialAlias: _address?.alias ?? 'Domicilio',
      initialFullAddress: _address?.fullAddress ?? '',
      initialCity: _address?.city ?? '',
      initialState: _address?.state ?? '',
      initialCountry: _address?.country ?? 'Colombia',
      initialPostalCode: _address?.postalCode ?? '',
      initialType: AddressType.home,
    );
    if (result == null || !mounted) return;
    setState(() => _busy = true);
    try {
      final existing = _address;
      final address = existing == null
          ? await _addressRepository.createAddress(
              alias: result.alias,
              fullAddress: result.fullAddress,
              city: result.city!,
              state: result.state!,
              country: result.country!,
              postalCode: result.postalCode!,
              type: result.type!,
            )
          : await _addressRepository.updateAddress(
              existing,
              alias: result.alias,
              fullAddress: result.fullAddress,
            );
      if (!mounted) return;
      setState(() {
        _address = address;
        _busy = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _busy = false);
      AppSnackBar.show(
        context,
        'No se pudo guardar la dirección. Inténtalo de nuevo.',
        type: AppSnackBarType.error,
      );
    }
  }

  Future<void> _addOrEditPhone() async {
    final result = await ContactFormSheet.show(
      context,
      isEditing: _phone != null,
      initialValue: _phone?.value ?? '',
      initialType: ContactType.phone,
    );
    if (result == null || !mounted) return;
    setState(() => _busy = true);
    try {
      final existing = _phone;
      final phone = existing == null
          ? await _contactRepository.createContact(
              type: ContactType.phone,
              value: result.value,
            )
          : await _contactRepository.updateContact(existing, value: result.value);
      if (!mounted) return;
      setState(() {
        _phone = phone;
        _busy = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _busy = false);
      AppSnackBar.show(
        context,
        'No se pudo guardar el teléfono. Inténtalo de nuevo.',
        type: AppSnackBarType.error,
      );
    }
  }

  bool get _canContinue =>
      _status == _Status.loaded &&
      !_busy &&
      _profile?.avatarUrl != null &&
      _address != null &&
      _phone != null;

  @override
  Widget build(BuildContext context) {
    if (_status == _Status.loading) {
      return const AppLoading(message: 'Cargando tu información...');
    }
    if (_status == _Status.error) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'No se pudo cargar tu información personal.',
            style: context.textStyles.bodyMedium?.copyWith(
              color: context.colors.error,
            ),
          ),
          const SizedBox(height: AppSpacing.space16),
          AppButton(label: 'Reintentar', onPressed: _load),
        ],
      );
    }

    final identity = _identity!;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        AppCard(
          child: Column(
            children: [
              AppAvatar(
                radius: AppSpacing.space48,
                imageUrl: _profile?.avatarUrl,
              ),
              const SizedBox(height: AppSpacing.space12),
              AppButton(
                label: _profile?.avatarUrl == null
                    ? 'Agregar foto'
                    : 'Cambiar foto',
                onPressed: _busy ? null : _changePhoto,
                isLoading: _busy,
                expand: false,
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.space16),
        AppCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Documento de identidad', style: context.textStyles.titleSmall),
              const SizedBox(height: AppSpacing.space12),
              AppInfoRow(label: 'Nombre completo', value: identity.fullName),
              AppInfoRow(
                label: 'Tipo de documento',
                value: documentTypeLabel(identity.documentType),
              ),
              AppInfoRow(label: 'Número', value: identity.documentNumber),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.space16),
        AppCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Dirección', style: context.textStyles.titleSmall),
              const SizedBox(height: AppSpacing.space8),
              if (_address != null) ...[
                Text(_address!.fullAddress, style: context.textStyles.bodyMedium),
                Text(
                  '${_address!.city}, ${_address!.state}',
                  style: context.textStyles.bodySmall,
                ),
                const SizedBox(height: AppSpacing.space12),
              ],
              AppButton(
                label: _address == null ? 'Agregar dirección' : 'Editar dirección',
                onPressed: _busy ? null : _addOrEditAddress,
                variant: AppButtonVariant.outlined,
                expand: false,
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.space16),
        AppCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Teléfono', style: context.textStyles.titleSmall),
              const SizedBox(height: AppSpacing.space8),
              if (_phone != null) ...[
                Text(_phone!.value, style: context.textStyles.bodyMedium),
                const SizedBox(height: AppSpacing.space12),
              ],
              AppButton(
                label: _phone == null ? 'Agregar teléfono' : 'Editar teléfono',
                onPressed: _busy ? null : _addOrEditPhone,
                variant: AppButtonVariant.outlined,
                expand: false,
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.space20),
        AppButton(
          label: 'Continuar',
          onPressed: _canContinue ? widget.onContinue : null,
        ),
      ],
    );
  }
}
