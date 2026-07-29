import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Date + time pickers for the requested schedule. The picked values
/// are surfaced to the parent via [onDateChanged]/[onTimeChanged] so
/// `RequestServicePage` can send the real chosen schedule when
/// submitting the request (see `RequestServiceRepository.createOrder`).
class ScheduleSelector extends StatefulWidget {
  const ScheduleSelector({
    super.key,
    required this.initialDate,
    required this.initialTime,
    this.onDateChanged,
    this.onTimeChanged,
  });

  final DateTime initialDate;
  final String initialTime;
  final ValueChanged<DateTime>? onDateChanged;
  final ValueChanged<String>? onTimeChanged;

  @override
  State<ScheduleSelector> createState() => _ScheduleSelectorState();
}

class _ScheduleSelectorState extends State<ScheduleSelector> {
  late DateTime _date;
  late String _time;

  @override
  void initState() {
    super.initState();
    _date = widget.initialDate;
    _time = widget.initialTime;
  }

  String _formatDate(DateTime date) {
    final day = date.day.toString().padLeft(2, '0');
    final month = date.month.toString().padLeft(2, '0');
    return '$day/$month/${date.year}';
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _date,
      firstDate: DateTime(_date.year - 1),
      lastDate: DateTime(_date.year + 1),
    );
    if (picked != null) {
      setState(() => _date = picked);
      widget.onDateChanged?.call(picked);
    }
  }

  Future<void> _pickTime() async {
    final parts = _time.split(':');
    final initialTime = TimeOfDay(
      hour: int.parse(parts[0]),
      minute: int.parse(parts[1]),
    );
    final picked = await showTimePicker(
      context: context,
      initialTime: initialTime,
    );
    if (picked != null) {
      final formatted =
          '${picked.hour.toString().padLeft(2, '0')}:'
          '${picked.minute.toString().padLeft(2, '0')}';
      setState(() => _time = formatted);
      widget.onTimeChanged?.call(formatted);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Fecha y hora'),
          Row(
            children: [
              Expanded(
                child: Semantics(
                  button: true,
                  label: 'Fecha programada: ${_formatDate(_date)}',
                  hint: 'Toca para cambiar la fecha',
                  child: InkWell(
                    onTap: _pickDate,
                    child: Row(
                      children: [
                        Icon(
                          Icons.calendar_today_outlined,
                          color: context.colors.primary,
                        ),
                        const SizedBox(width: AppSpacing.space8),
                        Flexible(
                          child: Text(
                            _formatDate(_date),
                            overflow: TextOverflow.ellipsis,
                            style: context.textStyles.bodyMedium,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.space8),
              Expanded(
                child: Semantics(
                  button: true,
                  label: 'Hora programada: $_time',
                  hint: 'Toca para cambiar la hora',
                  child: InkWell(
                    onTap: _pickTime,
                    child: Row(
                      children: [
                        Icon(
                          Icons.access_time_outlined,
                          color: context.colors.primary,
                        ),
                        const SizedBox(width: AppSpacing.space8),
                        Flexible(
                          child: Text(
                            _time,
                            overflow: TextOverflow.ellipsis,
                            style: context.textStyles.bodyMedium,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
