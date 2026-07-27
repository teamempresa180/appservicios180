import 'package:flutter/material.dart';
import '../../../../address/models/address_type.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_text_field.dart';

/// The fields this sheet collects. In edit mode only [alias]/
/// [fullAddress] are actually sent (see `updateAddress`'s doc comment
/// on why city/state/country/postalCode/type aren't updatable) — the
/// other fields are still shown, read-only, for context.
class AddressFormResult {
  const AddressFormResult({
    required this.alias,
    required this.fullAddress,
    this.city,
    this.state,
    this.country,
    this.postalCode,
    this.type,
  });

  final String alias;
  final String fullAddress;
  final String? city;
  final String? state;
  final String? country;
  final String? postalCode;
  final AddressType? type;
}

String addressTypeLabel(AddressType type) {
  switch (type) {
    case AddressType.home:
      return 'Casa';
    case AddressType.work:
      return 'Trabajo';
    case AddressType.billing:
      return 'Facturación';
    case AddressType.service:
      return 'Servicio';
    case AddressType.emergency:
      return 'Emergencia';
    case AddressType.other:
      return 'Otro';
  }
}

/// Bottom sheet form for creating or editing an [Address]. In create
/// mode ([isEditing] false) every field is collected; in edit mode only
/// alias/fullAddress are editable — the backend's `UpdateAddressRequestDto`
/// doesn't accept the rest. Returns an [AddressFormResult] via
/// [Navigator.pop], or `null` if the user cancels.
class AddressFormSheet extends StatefulWidget {
  const AddressFormSheet({
    super.key,
    this.isEditing = false,
    this.initialAlias = '',
    this.initialFullAddress = '',
    this.initialCity = '',
    this.initialState = '',
    this.initialCountry = '',
    this.initialPostalCode = '',
    this.initialType = AddressType.home,
  });

  final bool isEditing;
  final String initialAlias;
  final String initialFullAddress;
  final String initialCity;
  final String initialState;
  final String initialCountry;
  final String initialPostalCode;
  final AddressType initialType;

  static Future<AddressFormResult?> show(
    BuildContext context, {
    bool isEditing = false,
    String initialAlias = '',
    String initialFullAddress = '',
    String initialCity = '',
    String initialState = '',
    String initialCountry = '',
    String initialPostalCode = '',
    AddressType initialType = AddressType.home,
  }) {
    return showModalBottomSheet<AddressFormResult>(
      context: context,
      isScrollControlled: true,
      builder: (context) => AddressFormSheet(
        isEditing: isEditing,
        initialAlias: initialAlias,
        initialFullAddress: initialFullAddress,
        initialCity: initialCity,
        initialState: initialState,
        initialCountry: initialCountry,
        initialPostalCode: initialPostalCode,
        initialType: initialType,
      ),
    );
  }

  @override
  State<AddressFormSheet> createState() => _AddressFormSheetState();
}

class _AddressFormSheetState extends State<AddressFormSheet> {
  late final _aliasController = TextEditingController(text: widget.initialAlias);
  late final _fullAddressController = TextEditingController(
    text: widget.initialFullAddress,
  );
  late final _cityController = TextEditingController(text: widget.initialCity);
  late final _stateController = TextEditingController(text: widget.initialState);
  late final _countryController = TextEditingController(
    text: widget.initialCountry,
  );
  late final _postalCodeController = TextEditingController(
    text: widget.initialPostalCode,
  );
  late AddressType _type = widget.initialType;
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _aliasController.dispose();
    _fullAddressController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _countryController.dispose();
    _postalCodeController.dispose();
    super.dispose();
  }

  String? _requiredValidator(String? value) =>
      (value == null || value.trim().isEmpty) ? 'Este campo es obligatorio' : null;

  void _save() {
    if (!_formKey.currentState!.validate()) return;
    Navigator.of(context).pop(
      AddressFormResult(
        alias: _aliasController.text.trim(),
        fullAddress: _fullAddressController.text.trim(),
        city: widget.isEditing ? null : _cityController.text.trim(),
        state: widget.isEditing ? null : _stateController.text.trim(),
        country: widget.isEditing ? null : _countryController.text.trim(),
        postalCode: widget.isEditing ? null : _postalCodeController.text.trim(),
        type: widget.isEditing ? null : _type,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: AppSpacing.space20,
        right: AppSpacing.space20,
        top: AppSpacing.space20,
        bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.space20,
      ),
      child: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                widget.isEditing ? 'Editar dirección' : 'Agregar dirección',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: AppSpacing.space16),
              AppTextField(
                controller: _aliasController,
                label: 'Alias (Casa, Trabajo...)',
                prefixIcon: Icons.label_outline,
                validator: _requiredValidator,
              ),
              const SizedBox(height: AppSpacing.space12),
              AppTextField(
                controller: _fullAddressController,
                label: 'Dirección completa',
                prefixIcon: Icons.place_outlined,
                validator: _requiredValidator,
              ),
              if (!widget.isEditing) ...[
                const SizedBox(height: AppSpacing.space12),
                AppTextField(
                  controller: _cityController,
                  label: 'Ciudad',
                  prefixIcon: Icons.location_city_outlined,
                  validator: _requiredValidator,
                ),
                const SizedBox(height: AppSpacing.space12),
                AppTextField(
                  controller: _stateController,
                  label: 'Departamento/Estado',
                  validator: _requiredValidator,
                ),
                const SizedBox(height: AppSpacing.space12),
                AppTextField(
                  controller: _countryController,
                  label: 'País',
                  validator: _requiredValidator,
                ),
                const SizedBox(height: AppSpacing.space12),
                AppTextField(
                  controller: _postalCodeController,
                  label: 'Código postal',
                  validator: _requiredValidator,
                ),
                const SizedBox(height: AppSpacing.space12),
                DropdownButtonFormField<AddressType>(
                  initialValue: _type,
                  decoration: const InputDecoration(labelText: 'Tipo'),
                  items: [
                    for (final type in AddressType.values)
                      DropdownMenuItem(
                        value: type,
                        child: Text(addressTypeLabel(type)),
                      ),
                  ],
                  onChanged: (value) {
                    if (value != null) setState(() => _type = value);
                  },
                ),
              ],
              const SizedBox(height: AppSpacing.space20),
              AppButton(label: 'Guardar', onPressed: _save),
            ],
          ),
        ),
      ),
    );
  }
}
