import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../repositories/schedule_repository.dart';
import '../view_models/schedule_view_model.dart';
import '../widgets/schedule_empty_state.dart';
import '../widgets/schedule_header.dart';
import '../widgets/schedule_list.dart';
import '../widgets/schedule_loading.dart';
import '../widgets/schedule_statistics.dart';

/// Schedule screen. Does NOT build its own `Scaffold` — it is meant to
/// live within the existing navigation flow (opened from `Provider
/// Dashboard`). Completely independent: its own repository, its own
/// view model.
///
/// Shows a single, fixed provider's agenda (no id-based lookup yet) —
/// see the feature README.
class SchedulePage extends StatefulWidget {
  const SchedulePage({super.key, ScheduleRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final ScheduleRepository? _repository;

  @override
  State<SchedulePage> createState() => _SchedulePageState();
}

class _SchedulePageState extends State<SchedulePage> {
  late final ScheduleViewModel _viewModel = ScheduleViewModel(
    widget._repository ?? locator<ScheduleRepository>(),
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

  Widget _buildBody() {
    switch (_viewModel.status) {
      case ScheduleLoadStatus.loading:
        return const ScheduleLoading();
      case ScheduleLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudo cargar la agenda',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case ScheduleLoadStatus.success:
        final data = _viewModel.data!;
        if (data.schedules.isEmpty) return const ScheduleEmptyState();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: ScheduleStatistics(data: data)),
            const SizedBox(height: AppSpacing.space16),
            ScheduleList(schedules: data.schedules),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(header: const ScheduleHeader(), body: _buildBody());
  }
}
