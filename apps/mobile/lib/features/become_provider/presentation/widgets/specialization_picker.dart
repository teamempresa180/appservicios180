import 'package:flutter/material.dart';
import '../../../../category/models/category_id.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../specialization/models/specialization.dart';
import '../../specialization/repositories/specialization_repository.dart';

/// Paso 2's specialization picker: loads the [Specialization] list for
/// [categoryId] via [SpecializationRepository.getByCategory] and lets
/// the applicant choose one, returning `(id, name)` through
/// [onSelected]. Backed by the real `HttpSpecializationRepository`
/// (`GET /categories/:categoryId/specializations`) in production, or
/// `MockSpecializationRepository` in offline/mock mode — this widget
/// doesn't know or care which one it's talking to.
///
/// Reloads automatically when [categoryId] changes (the applicant
/// picking a different category in Paso 2) and clears any selection
/// that no longer belongs to the new list.
class SpecializationPicker extends StatefulWidget {
  const SpecializationPicker({
    super.key,
    required this.categoryId,
    this.initialSpecializationId,
    required this.onSelected,
    SpecializationRepository? repository,
  }) : _repository = repository;

  final CategoryId categoryId;
  final String? initialSpecializationId;
  final ValueChanged<Specialization> onSelected;
  final SpecializationRepository? _repository;

  @override
  State<SpecializationPicker> createState() => _SpecializationPickerState();
}

enum _Status { loading, loaded, error }

class _SpecializationPickerState extends State<SpecializationPicker> {
  late final SpecializationRepository _repository =
      widget._repository ?? locator<SpecializationRepository>();

  _Status _status = _Status.loading;
  List<Specialization> _options = const [];
  Specialization? _selected;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void didUpdateWidget(covariant SpecializationPicker oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.categoryId.value != widget.categoryId.value) {
      _selected = null;
      _load();
    }
  }

  Future<void> _load() async {
    setState(() => _status = _Status.loading);
    try {
      final options = await _repository.getByCategory(widget.categoryId);
      if (!mounted) return;
      final preselected = widget.initialSpecializationId == null
          ? null
          : options
                .cast<Specialization?>()
                .firstWhere(
                  (s) => s?.id == widget.initialSpecializationId,
                  orElse: () => null,
                );
      setState(() {
        _options = options;
        _selected = preselected;
        _status = _Status.loaded;
      });
      if (preselected != null) widget.onSelected(preselected);
    } catch (_) {
      if (!mounted) return;
      setState(() => _status = _Status.error);
    }
  }

  @override
  Widget build(BuildContext context) {
    switch (_status) {
      case _Status.loading:
        return const Padding(
          padding: EdgeInsets.symmetric(vertical: AppSpacing.space12),
          child: Center(
            child: SizedBox(
              height: AppSpacing.space24,
              width: AppSpacing.space24,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
          ),
        );
      case _Status.error:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'No se pudieron cargar las especializaciones.',
              style: context.textStyles.bodySmall?.copyWith(
                color: context.colors.error,
              ),
            ),
            const SizedBox(height: AppSpacing.space8),
            AppButton(
              label: 'Reintentar',
              onPressed: _load,
              expand: false,
              variant: AppButtonVariant.outlined,
            ),
          ],
        );
      case _Status.loaded:
        return DropdownButtonFormField<Specialization>(
          initialValue: _selected,
          isExpanded: true,
          decoration: const InputDecoration(labelText: 'Especialización'),
          items: [
            for (final option in _options)
              DropdownMenuItem(value: option, child: Text(option.name)),
          ],
          onChanged: (value) {
            if (value == null) return;
            setState(() => _selected = value);
            widget.onSelected(value);
          },
          validator: (value) =>
              value == null ? 'Selecciona una especialización.' : null,
        );
    }
  }
}
