import '../entities/order.dart';
import '../models/order_status.dart';
import '../../quote/entities/quote.dart';
import 'order_journey_action.dart';
import 'order_journey_info.dart';
import 'order_journey_stage.dart';

/// Derives "what's happening and what can I do" for a client looking at
/// one of their own `Order`s. Pure function of already-fetched data
/// (`order`, that order's `quotes`, whether the client already
/// `hasReviewed` it) — never fetches anything itself, so it stays
/// trivially testable and reusable from any client-facing screen (Home,
/// Orders list, an order detail page) without duplicating this
/// state-to-copy mapping in each one.
abstract final class ClientOrderJourney {
  static OrderJourneyInfo derive({
    required Order order,
    required List<Quote> quotes,
    required bool hasReviewed,
  }) {
    switch (order.status) {
      case OrderStatus.cancelled:
        return const OrderJourneyInfo(
          stage: OrderJourneyStage.requested,
          title: 'Solicitud cancelada',
          description: 'Cancelaste esta solicitud. Puedes crear una nueva cuando quieras.',
          helpMessage: '',
          actions: [],
          cancelled: true,
        );
      case OrderStatus.rejected:
        return const OrderJourneyInfo(
          stage: OrderJourneyStage.requested,
          title: 'Solicitud rechazada',
          description: 'Esta solicitud fue rechazada. Puedes publicar una nueva o elegir otro proveedor.',
          helpMessage: '',
          actions: [],
          cancelled: true,
        );

      case OrderStatus.pending:
        if (quotes.isEmpty) {
          return OrderJourneyInfo(
            stage: OrderJourneyStage.awaitingQuotes,
            title: 'Esperando cotizaciones',
            description: order.isDirectHire
                ? 'Le avisamos al proveedor sobre tu solicitud. Te notificaremos aquí en cuanto responda.'
                : 'Tu solicitud está abierta a los proveedores compatibles con esta categoría.',
            helpMessage: 'Puedes cancelar la solicitud mientras esperas una respuesta.',
            actions: const [
              OrderJourneyAction(OrderJourneyActionKind.cancelOrder, 'Cancelar solicitud'),
            ],
          );
        }
        return OrderJourneyInfo(
          stage: OrderJourneyStage.quotesReceived,
          title: quotes.length == 1
              ? 'Recibiste una cotización'
              : 'Recibiste ${quotes.length} cotizaciones',
          description: 'Compara el precio y el tiempo estimado, y elige la que más te convenga.',
          helpMessage: 'Aceptar una cotización asigna el servicio a ese proveedor.',
          actions: const [
            OrderJourneyAction(OrderJourneyActionKind.viewQuotes, 'Ver cotizaciones'),
            OrderJourneyAction(OrderJourneyActionKind.cancelOrder, 'Cancelar solicitud'),
          ],
        );

      case OrderStatus.accepted:
        return OrderJourneyInfo(
          stage: OrderJourneyStage.scheduled,
          title: 'Servicio programado',
          description:
              'Tu proveedor fue asignado. El servicio está programado para el ${_formatDate(order.scheduledDate)}.',
          helpMessage: 'Puedes escribirle por chat si necesitas coordinar algún detalle.',
          actions: const [
            OrderJourneyAction(OrderJourneyActionKind.openChat, 'Abrir chat'),
            OrderJourneyAction(OrderJourneyActionKind.cancelOrder, 'Cancelar solicitud'),
          ],
        );

      case OrderStatus.inProgress:
        return const OrderJourneyInfo(
          stage: OrderJourneyStage.inProgress,
          title: 'Servicio en progreso',
          description: 'El proveedor está realizando el trabajo en este momento.',
          helpMessage: 'Puedes escribirle por chat si necesitas comunicarte con él.',
          actions: [
            OrderJourneyAction(OrderJourneyActionKind.openChat, 'Abrir chat'),
          ],
        );

      case OrderStatus.completed:
        if (hasReviewed) {
          return const OrderJourneyInfo(
            stage: OrderJourneyStage.done,
            title: 'Servicio completado',
            description: 'Ya calificaste este servicio. ¡Gracias por tu opinión!',
            helpMessage: '',
            actions: [],
          );
        }
        return const OrderJourneyInfo(
          stage: OrderJourneyStage.awaitingRating,
          title: 'Servicio finalizado',
          description: 'El proveedor marcó este servicio como finalizado. Cuéntanos cómo te fue.',
          helpMessage: 'Tu calificación ayuda a otros clientes a elegir mejor.',
          actions: [
            OrderJourneyAction(OrderJourneyActionKind.rateProvider, 'Calificar proveedor'),
          ],
        );
    }
  }

  static String _formatDate(DateTime date) {
    const months = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
    ];
    final hour = date.hour % 12 == 0 ? 12 : date.hour % 12;
    final period = date.hour >= 12 ? 'p. m.' : 'a. m.';
    final minute = date.minute.toString().padLeft(2, '0');
    return '${date.day} de ${months[date.month - 1]} a las $hour:$minute $period';
  }
}
