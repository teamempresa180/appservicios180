import 'package:flutter/material.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../mock/mock_availability_data.dart';
import '../../models/availability_display.dart';
import '../../repositories/mock_availability_repository.dart';
import '../widgets/availability_actions.dart';
import '../widgets/availability_empty_state.dart';
import '../widgets/availability_header.dart';
import '../widgets/availability_loading.dart';
import '../widgets/availability_statistics.dart';
import '../widgets/save_availability_button.dart';
import '../widgets/weekly_schedule.dart';

/// The three purely-visual states this screen can render — same
/// fixed-`state` approach as every list/detail feature since `search`.
enum AvailabilityViewState { loading, empty, information }

/// Availability screen. Does NOT build its own `Scaffold` — it is
/// meant to live within the existing navigation flow (opened from
/// `Provider Dashboard`). Completely independent: its own repository,
/// its own mock data.
///
/// Shows a single, fixed provider's weekly schedule (no id-based
/// lookup yet) — see the feature README.
class AvailabilityPage extends StatelessWidget {
  const AvailabilityPage({
    super.key,
    this.state = AvailabilityViewState.information,
  });

  final AvailabilityViewState state;

  AvailabilityDisplay _buildData() {
    final repository = MockAvailabilityRepository();

    return AvailabilityDisplay(
      provider: repository.getProvider(),
      availabilities: repository.getAvailabilities(),
      nextAvailableLabel: mockAvailabilityNextAvailableLabel,
      workingHoursLabel: mockAvailabilityWorkingHoursLabel,
    );
  }

  Widget _buildBody() {
    switch (state) {
      case AvailabilityViewState.loading:
        return const AvailabilityLoading();
      case AvailabilityViewState.empty:
        return const AvailabilityEmptyState();
      case AvailabilityViewState.information:
        final data = _buildData();
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
