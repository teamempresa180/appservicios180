import 'package:flutter/material.dart';
import '../../../../category/entities/category.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_text_field.dart';
import '../../../../service/models/service_type.dart';

/// The fields this sheet collects. In edit mode only [basePrice]/
/// [estimatedDuration] are actually sent (see `updateService`'s doc
/// comment on why name/description/category aren't updatable) — the
/// other fields are still shown, read-only, for context.
class ServiceFormResult {
  const ServiceFormResult({
    required this.basePrice,
    required this.estimatedDuration,
    this.name,
    this.description,
    this.category,
    this.type,
  });

  final num basePrice;
  final int estimatedDuration;
  final String? name;
  final String? description;
  final Category? category;
  final ServiceType? type;
}

String serviceTypeLabel(ServiceType type) {
  switch (type) {
    case ServiceType.standard:
      return 'Estándar';
    case ServiceType.express:
      return 'Express';
    case ServiceType.custom:
      return 'Personalizado';
    case ServiceType.other:
      return 'Otro';
  }
}

/// Bottom sheet form for creating or editing a [Service]. In create
/// mode ([isEditing] false) every field is collected, including a
/// [Category] picked from [categories] (the provider's already-used
/// categories — this screen has no general category browser). In edit
/// mode only price/duration are editable. Returns a [ServiceFormResult]
/// via [Navigator.pop], or `null` if the user cancels.
class ServiceFormSheet extends StatefulWidget {
  const ServiceFormSheet({
    super.key,
    this.isEditing = false,
    this.categories = const [],
    this.initialName = '',
    this.initialDescription = '',
    this.initialBasePrice = 0,
    this.initialEstimatedDuration = 60,
  });

  final bool isEditing;
  final List<Category> categories;
  final String initialName;
  final String initialDescription;
  final num initialBasePrice;
  final int initialEstimatedDuration;

  static Future<ServiceFormResult?> show(
    BuildContext context, {
    bool isEditing = false,
    List<Category> categories = const [],
    String initialName = '',
    String initialDescription = '',
    num initialBasePrice = 0,
    int initialEstimatedDuration = 60,
  }) {
    return showModalBottomSheet<ServiceFormResult>(
      context: context,
      isScrollControlled: true,
      builder: (context) => ServiceFormSheet(
        isEditing: isEditing,
        categories: categories,
        initialName: initialName,
        initialDescription: initialDescription,
        initialBasePrice: initialBasePrice,
        initialEstimatedDuration: initialEstimatedDuration,
      ),
    );
  }

  @override
  State<ServiceFormSheet> createState() => _ServiceFormSheetState();
}

class _ServiceFormSheetState extends State<ServiceFormSheet> {
  late final _nameController = TextEditingController(text: widget.initialName);
  late final _descriptionController = TextEditingController(
    text: widget.initialDescription,
  );
  late final _priceController = TextEditingController(
    text: widget.initialBasePrice.toString(),
  );
  late final _durationController = TextEditingController(
    text: widget.initialEstimatedDuration.toString(),
  );
  Category? _category;
  ServiceType _type = ServiceType.standard;
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    if (widget.categories.isNotEmpty) _category = widget.categories.first;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    _durationController.dispose();
    super.dispose();
  }

  String? _requiredValidator(String? value) =>
      (value == null || value.trim().isEmpty) ? 'Este campo es obligatorio' : null;

  String? _numberValidator(String? value) {
    if (value == null || value.trim().isEmpty) return 'Este campo es obligatorio';
    return num.tryParse(value.trim()) == null ? 'Ingresa un número válido' : null;
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;
    if (!widget.isEditing && _category == null) return;
    Navigator.of(context).pop(
      ServiceFormResult(
        basePrice: num.parse(_priceController.text.trim()),
        estimatedDuration: int.parse(_durationController.text.trim()),
        name: widget.isEditing ? null : _nameController.text.trim(),
        description: widget.isEditing ? null : _descriptionController.text.trim(),
        category: widget.isEditing ? null : _category,
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
                widget.isEditing ? 'Editar servicio' : 'Nuevo servicio',
                style: context.textStyles.titleLarge,
              ),
              const SizedBox(height: AppSpacing.space16),
              if (!widget.isEditing) ...[
                AppTextField(
                  controller: _nameController,
                  label: 'Nombre del servicio',
                  prefixIcon: Icons.design_services_outlined,
                  validator: _requiredValidator,
                ),
                const SizedBox(height: AppSpacing.space12),
                AppTextField(
                  controller: _descriptionController,
                  label: 'Descripción',
                  validator: _requiredValidator,
                ),
                const SizedBox(height: AppSpacing.space12),
                if (widget.categories.isNotEmpty)
                  DropdownButtonFormField<Category>(
                    initialValue: _category,
                    decoration: const InputDecoration(labelText: 'Categoría'),
                    items: [
                      for (final category in widget.categories)
                        DropdownMenuItem(
                          value: category,
                          child: Text(category.name),
                        ),
                    ],
                    onChanged: (value) => setState(() => _category = value),
                  )
                else
                  Text(
                    'No tienes categorías disponibles todavía.',
                    style: context.textStyles.bodySmall,
                  ),
                const SizedBox(height: AppSpacing.space12),
                DropdownButtonFormField<ServiceType>(
                  initialValue: _type,
                  decoration: const InputDecoration(labelText: 'Tipo'),
                  items: [
                    for (final type in ServiceType.values)
                      DropdownMenuItem(
                        value: type,
                        child: Text(serviceTypeLabel(type)),
                      ),
                  ],
                  onChanged: (value) {
                    if (value != null) setState(() => _type = value);
                  },
                ),
                const SizedBox(height: AppSpacing.space12),
              ],
              AppTextField(
                controller: _priceController,
                label: 'Precio base',
                keyboardType: TextInputType.number,
                prefixIcon: Icons.attach_money,
                validator: _numberValidator,
              ),
              const SizedBox(height: AppSpacing.space12),
              AppTextField(
                controller: _durationController,
                label: 'Duración estimada (minutos)',
                keyboardType: TextInputType.number,
                prefixIcon: Icons.timer_outlined,
                validator: _numberValidator,
              ),
              const SizedBox(height: AppSpacing.space20),
              AppButton(
                label: 'Guardar',
                onPressed: (!widget.isEditing && widget.categories.isEmpty)
                    ? null
                    : _save,
              ),
              const SizedBox(height: AppSpacing.space8),
              AppButton(
                label: 'Cancelar',
                variant: AppButtonVariant.text,
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
