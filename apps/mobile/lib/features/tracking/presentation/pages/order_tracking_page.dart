import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../order/entities/order.dart';
import '../../models/tracking_update.dart';
import '../../repositories/tracking_repository.dart';
import '../widgets/tracking_info_panel.dart';
import '../widgets/tracking_map.dart';

/// The Uber/inDrive-style "sigue tu servicio" screen — shown to either
/// role once an Order is `accepted`/`inProgress`: the client sees their
/// provider approaching, the provider sees their route to the client.
/// Subscribes to `TrackingRepository.watchTracking` for the whole
/// lifetime of the page.
///
/// [otherPartyName]/[otherPartyLabel] are passed in by the caller
/// rather than looked up here — `Order` alone doesn't carry the other
/// party's display name (see `OrderDisplay`, which already joins
/// `Profile` for that), so `OrderActions` (which already has an
/// `OrderDisplay`) passes it straight through instead of this page
/// re-deriving it.
class OrderTrackingPage extends StatefulWidget {
  const OrderTrackingPage({
    super.key,
    required this.order,
    required this.otherPartyName,
    required this.otherPartyLabel,
    TrackingRepository? repository,
  }) : _repository = repository;

  final Order order;
  final String otherPartyName;
  final String otherPartyLabel;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final TrackingRepository? _repository;

  @override
  State<OrderTrackingPage> createState() => _OrderTrackingPageState();
}

class _OrderTrackingPageState extends State<OrderTrackingPage> {
  late final TrackingRepository _repository =
      widget._repository ?? locator<TrackingRepository>();
  late final Stream<TrackingUpdate> _stream = _repository.watchTracking(
    widget.order.id,
  );

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      appBar: AppBar(title: const Text('Rastrear servicio')),
      body: StreamBuilder<TrackingUpdate>(
        stream: _stream,
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return const AppEmptyState(
              icon: AppIcons.error,
              title: 'No se pudo cargar el rastreo',
              description: 'Ocurrió un problema al obtener la ubicación.',
            );
          }
          final update = snapshot.data;
          if (update == null) {
            return const AppLoading(message: 'Buscando ubicación...');
          }
          return Stack(
            fit: StackFit.expand,
            children: [
              TrackingMap(update: update, isDark: isDark),
              Align(
                alignment: Alignment.bottomCenter,
                child: SafeArea(
                  top: false,
                  child: TrackingInfoPanel(
                    update: update,
                    otherPartyName: widget.otherPartyName,
                    otherPartyLabel: widget.otherPartyLabel,
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
