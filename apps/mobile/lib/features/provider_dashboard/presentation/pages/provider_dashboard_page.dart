import 'package:flutter/material.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../availability/presentation/pages/availability_page.dart';
import '../../../provider_services/presentation/pages/provider_services_page.dart';
import '../../../schedule/presentation/pages/schedule_page.dart';
import '../../mock/mock_provider_dashboard_data.dart';
import '../../models/provider_dashboard_display.dart';
import '../../repositories/mock_provider_dashboard_repository.dart';
import '../widgets/dashboard_empty_state.dart';
import '../widgets/dashboard_header.dart';
import '../widgets/dashboard_loading.dart';
import '../widgets/dashboard_statistics.dart';
import '../widgets/earnings_summary.dart';
import '../widgets/pending_requests.dart';
import '../widgets/provider_performance.dart';
import '../widgets/quick_actions.dart';
import '../widgets/recent_orders.dart';

/// The three purely-visual states this screen can render — same
/// fixed-`state` approach as every list/detail feature since `search`.
enum ProviderDashboardViewState { loading, empty, information }

/// Provider Dashboard screen. Does NOT build its own `Scaffold` — it
/// is meant to live within the existing navigation flow (opened from
/// `Profile`). Completely independent: its own repository, its own
/// mock data.
///
/// Shows a single, fixed provider's dashboard (no id-based lookup yet)
/// — see the feature README.
class ProviderDashboardPage extends StatelessWidget {
  const ProviderDashboardPage({
    super.key,
    this.state = ProviderDashboardViewState.information,
  });

  final ProviderDashboardViewState state;

  ProviderDashboardDisplay _buildData() {
    final repository = MockProviderDashboardRepository();

    return ProviderDashboardDisplay(
      provider: repository.getProvider(),
      profile: repository.getProfile(),
      orders: repository.getOrders(),
      quotes: repository.getQuotes(),
      reviews: repository.getReviews(),
      payments: repository.getPayments(),
      todayEarnings: mockDashboardTodayEarnings,
      weeklyEarnings: mockDashboardWeeklyEarnings,
      monthlyEarnings: mockDashboardMonthlyEarnings,
      averageResponseTime: mockDashboardAverageResponseTime,
      acceptanceRate: mockDashboardAcceptanceRate,
    );
  }

  void _openProviderServices(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Mis servicios')),
          body: const SafeArea(child: ProviderServicesPage()),
        ),
      ),
    );
  }

  void _openAvailability(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Disponibilidad')),
          body: const SafeArea(child: AvailabilityPage()),
        ),
      ),
    );
  }

  void _openSchedule(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Agenda')),
          body: const SafeArea(child: SchedulePage()),
        ),
      ),
    );
  }

  Widget _buildBody(BuildContext context) {
    switch (state) {
      case ProviderDashboardViewState.loading:
        return const DashboardLoading();
      case ProviderDashboardViewState.empty:
        return const DashboardEmptyState();
      case ProviderDashboardViewState.information:
        final data = _buildData();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: EarningsSummary(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: DashboardStatistics(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: ProviderPerformance(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: RecentOrders(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: PendingRequests(data: data)),
            const SizedBox(height: AppSpacing.space16),
            QuickActions(
              onViewServices: () => _openProviderServices(context),
              onAvailability: () => _openAvailability(context),
              onSchedule: () => _openSchedule(context),
            ),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(
      header: DashboardHeader(data: _buildData()),
      body: _buildBody(context),
    );
  }
}
