import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../repositories/notifications_repository.dart';
import '../view_models/notifications_view_model.dart';
import '../widgets/notification_filter_tabs.dart';
import '../widgets/notifications_empty_state.dart';
import '../widgets/notifications_header.dart';
import '../widgets/notifications_list.dart';
import '../widgets/notifications_loading.dart';

/// Notifications screen. Does NOT build its own `Scaffold` — it is
/// meant to live within the existing navigation flow, the same way
/// every other feature so far does. Completely independent: its own
/// repository, its own view model, loaded from the real backend via
/// [NotificationsViewModel] (resolved from the service locator — see
/// `core/di/service_locator.dart`).
///
/// Shows a fixed list of notifications (no id-based lookup yet) — see
/// the feature README.
class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key, NotificationsRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final NotificationsRepository? _repository;

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  late final NotificationsViewModel _viewModel = NotificationsViewModel(
    widget._repository ?? locator<NotificationsRepository>(),
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
      case NotificationsLoadStatus.loading:
        return const NotificationsLoading();
      case NotificationsLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudieron cargar las notificaciones',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case NotificationsLoadStatus.success:
        return _viewModel.notifications.isEmpty
            ? const NotificationsEmptyState()
            : NotificationsList(notifications: _viewModel.notifications);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(
      header: const NotificationsHeader(),
      toolbar: const [NotificationFilterTabs()],
      body: _buildBody(),
    );
  }
}
