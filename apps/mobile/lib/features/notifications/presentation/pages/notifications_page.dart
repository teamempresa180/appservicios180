import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../models/notification_display.dart';
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

  NotificationTab _selectedTab = NotificationTab.all;

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

  List<NotificationDisplay> get _filteredNotifications {
    switch (_selectedTab) {
      case NotificationTab.all:
        return _viewModel.notifications;
      case NotificationTab.unread:
        return _viewModel.notifications.where((n) => n.isUnread).toList();
      case NotificationTab.orders:
        return _viewModel.notifications
            .where((n) => n.category == NotificationCategory.order)
            .toList();
      case NotificationTab.payments:
        return _viewModel.notifications
            .where((n) => n.category == NotificationCategory.payment)
            .toList();
      case NotificationTab.messages:
        return _viewModel.notifications
            .where((n) => n.category == NotificationCategory.chat)
            .toList();
    }
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
        final filtered = _filteredNotifications;
        return filtered.isEmpty
            ? const NotificationsEmptyState()
            : NotificationsList(notifications: filtered);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(
      header: const NotificationsHeader(),
      toolbar: [
        NotificationFilterTabs(
          selected: _selectedTab,
          onChanged: (tab) => setState(() => _selectedTab = tab),
        ),
      ],
      body: _buildBody(),
    );
  }
}
