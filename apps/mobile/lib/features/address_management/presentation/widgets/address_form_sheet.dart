import 'package:flutter/material.dart';
import '../../../../address/models/address_type.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_text_field.dart';
import 'address_map_picker.dart';

/// The fields this sheet collects. In edit mode only [alias]/
/// [fullAddress]/[latitude]/[longitude] are actually sent (see
/// `updateAddress`'s doc comment on why city/state/country/postalCode/
/// type aren't updatable) — the other fields are still shown,
/// read-only, for context. [latitude]/[longitude] are always a pair —
/// both set or both `null` — never just one.
class AddressFormResult {
  const AddressFormResult({
    required this.alias,
    required this.fullAddress,
    this.city,
    this.state,
    this.country,
    this.postalCode,
    this.type,
    this.latitude,
    this.longitude,
  });

  final String alias;
  final String fullAddress;
  final String? city;
  final String? state;
  final String? country;
  final String? postalCode;
  final AddressType? type;
  final double? latitude;
  final double? longitude;
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
    this.initialLatitude,
    this.initialLongitude,
  });

  final bool isEditing;
  final String initialAlias;
  final String initialFullAddress;
  final String initialCity;
  final String initialState;
  final String initialCountry;
  final String initialPostalCode;
  final AddressType initialType;
  final double? initialLatitude;
  final double? initialLongitude;

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
    double? initialLatitude,
    double? initialLongitude,
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
        initialLatitude: initialLatitude,
        initialLongitude: initialLongitude,
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
  late double? _latitude = widget.initialLatitude;
  late double? _longitude = widget.initialLongitude;
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

  /// Required + a sane upper bound. Without the cap a pasted wall of
  /// text sailed through the form and only failed later, at the
  /// backend's own column limit, as a generic save error.
  String? Function(String?) _requiredMaxValidator(int max) {
    return (value) {
      final required = _requiredValidator(value);
      if (required != null) return required;
      if (value!.trim().length > max) {
        return 'Máximo $max caracteres';
      }
      return null;
    };
  }

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
        latitude: _latitude,
        longitude: _longitude,
      ),
    );
  }

  Future<void> _pickLocation() async {
    final result = await AddressMapPicker.show(
      context,
      initialLatitude: _latitude,
      initialLongitude: _longitude,
    );
    if (result == null || !mounted) return;
    setState(() {
      _latitude = result.latitude;
      _longitude = result.longitude;
    });
  }

  void _clearLocation() {
    setState(() {
      _latitude = null;
      _longitude = null;
    });
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
                maxLength: 40,
                validator: _requiredMaxValidator(40),
              ),
              const SizedBox(height: AppSpacing.space12),
              AppTextField(
                controller: _fullAddressController,
                label: 'Dirección completa',
                prefixIcon: Icons.place_outlined,
                maxLength: 160,
                validator: _requiredMaxValidator(160),
              ),
              if (!widget.isEditing) ...[
                const SizedBox(height: AppSpacing.space12),
                AppTextField(
                  controller: _cityController,
                  label: 'Ciudad',
                  prefixIcon: Icons.location_city_outlined,
                  maxLength: 60,
                  validator: _requiredMaxValidator(60),
                ),
                const SizedBox(height: AppSpacing.space12),
                AppTextField(
                  controller: _stateController,
                  label: 'Departamento/Estado',
                  maxLength: 60,
                  validator: _requiredMaxValidator(60),
                ),
                const SizedBox(height: AppSpacing.space12),
                AppTextField(
                  controller: _countryController,
                  label: 'País',
                  maxLength: 60,
                  validator: _requiredMaxValidator(60),
                ),
                const SizedBox(height: AppSpacing.space12),
                AppTextField(
                  controller: _postalCodeController,
                  label: 'Código postal',
                  keyboardType: TextInputType.number,
                  maxLength: 12,
                  validator: _requiredMaxValidator(12),
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
              const SizedBox(height: AppSpacing.space16),
              _LocationSection(
                latitude: _latitude,
                longitude: _longitude,
                onPick: _pickLocation,
                onClear: _clearLocation,
              ),
              const SizedBox(height: AppSpacing.space20),
              AppButton(label: 'Guardar', onPressed: _save),
            ],
          ),
        ),
      ),
    );
  }
}

/// "Ubicar en el mapa" section — an optional step, never required to
/// save the address (map permission/GPS/network problems must never
/// block saving via the text fields alone, see `AddressMapPicker`'s
/// doc comment). Shows a compact summary once a pin is set, or an
/// invitation to pick one otherwise.
class _LocationSection extends StatelessWidget {
  const _LocationSection({
    required this.latitude,
    required this.longitude,
    required this.onPick,
    required this.onClear,
  });

  final double? latitude;
  final double? longitude;
  final VoidCallback onPick;
  final VoidCallback onClear;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final hasPin = latitude != null && longitude != null;

    return Container(
      padding: const EdgeInsets.all(AppSpacing.space12),
      decoration: BoxDecoration(
        border: Border.all(color: theme.colorScheme.outlineVariant),
        borderRadius: BorderRadius.circular(AppRadius.radius12),
      ),
      child: Row(
        children: [
          Icon(
            hasPin ? Icons.location_on : Icons.location_on_outlined,
            color: hasPin ? theme.colorScheme.primary : theme.colorScheme.outline,
          ),
          const SizedBox(width: AppSpacing.space12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Ubicar en el mapa', style: theme.textTheme.bodyMedium),
                if (hasPin)
                  Text(
                    '${latitude!.toStringAsFixed(5)}, ${longitude!.toStringAsFixed(5)}',
                    style: theme.textTheme.bodySmall,
                  )
                else
                  Text(
                    'Opcional: marca el punto exacto en el mapa.',
                    style: theme.textTheme.bodySmall,
                  ),
              ],
            ),
          ),
          if (hasPin)
            IconButton(
              icon: const Icon(Icons.close),
              tooltip: 'Quitar ubicación',
              onPressed: onClear,
            ),
          TextButton(
            onPressed: onPick,
            child: Text(hasPin ? 'Cambiar' : 'Ubicar'),
          ),
        ],
      ),
    );
  }
}
