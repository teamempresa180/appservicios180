import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/schedule_display.dart';
import '../../repositories/mock_schedule_repository.dart';
import '../widgets/schedule_empty_state.dart';
import '../widgets/schedule_header.dart';
import '../widgets/schedule_list.dart';
import '../widgets/schedule_loading.dart';
import '../widgets/schedule_statistics.dart';

/// The three purely-visual states this screen can render — same
/// fixed-`state` approach as every list/detail feature since `search`.
enum ScheduleViewState { loading, empty, information }

/// Schedule screen. Does NOT build its own `Scaffold` — it is meant to
/// live within the existing navigation flow (opened from `Provider
/// Dashboard`). Completely independent: its own repository, its own
/// mock data.
///
/// Shows a single, fixed provider's agenda (no id-based lookup yet) —
/// see the feature README.
class SchedulePage extends StatelessWidget {
  const SchedulePage({super.key, this.state = ScheduleViewState.information});

  final ScheduleViewState state;

  ScheduleDisplay _buildData() {
    final repository = MockScheduleRepository();

    return ScheduleDisplay(
      provider: repository.getProvider(),
      schedules: repository.getSchedules(),
    );
  }

  Widget _buildBody() {
    switch (state) {
      case ScheduleViewState.loading:
        return const ScheduleLoading();
      case ScheduleViewState.empty:
        return const ScheduleEmptyState();
      case ScheduleViewState.information:
        final data = _buildData();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: ScheduleStatistics(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: ScheduleList(schedules: data.schedules)),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const FadeIn(child: ScheduleHeader()),
          const SizedBox(height: AppSpacing.space16),
          _buildBody(),
        ],
      ),
    );
  }
}
