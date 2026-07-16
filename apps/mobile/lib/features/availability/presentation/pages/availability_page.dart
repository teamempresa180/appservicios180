import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../repositories/availability_repository.dart';
import '../view_models/availability_view_model.dart';
import '../widgets/availability_actions.dart';
import '../widgets/availability_empty_state.dart';
import '../widgets/availability_header.dart';
import '../widgets/availability_loading.dart';
import '../widgets/availability_statistics.dart';
import '../widgets/save_availability_button.dart';
import '../widgets/weekly_schedule.dart';

/// Availability screen: a single provider's weekly schedule, loaded
/// from the real backend via [AvailabilityViewModel] (resolved from
/// the service locator — see `core/di/service_locator.dart`). Does NOT
/// build its own `Scaffold` — it is meant to live within the existing
/// navigation flow (opened from `Provider Dashboard`). Completely
/// independent: its own repository, its own view model.
///
/// Shows a single, fixed provider's weekly schedule (no id-based
/// lookup yet) — see the feature README.
class AvailabilityPage extends StatefulWidget {
  const AvailabilityPage({super.key, AvailabilityRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final AvailabilityRepository? _repository;

  @override
  State<AvailabilityPage> createState() => _AvailabilityPageState();
}

class _AvailabilityPageState extends State<AvailabilityPage> {
  late final AvailabilityViewModel _viewModel = AvailabilityViewModel(
    widget._repository ?? locator<AvailabilityRepository>(),
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
      case AvailabilityLoadStatus.loading:
        return const AvailabilityLoading();
      case AvailabilityLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudo cargar la disponibilidad',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case AvailabilityLoadStatus.success:
        final data = _viewModel.data!;
        if (data.availabilities.isEmpty) {
          return const AvailabilityEmptyState();
        }
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: AvailabilityStatistics(data: data)),
            const SizedBox(height: AppSpacing.space16),
            WeeklySchedule(availabilities: data.availabilities),
            const SizedBox(height: AppSpacing.space16),
            const AvailabilityActions(),
            const SizedBox(height: AppSpacing.space16),
            const SaveAvailabilityButton(),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(header: const AvailabilityHeader(), body: _buildBody());
  }
}
